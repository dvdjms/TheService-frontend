import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput,  } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, 
    AnimatedRef, DerivedValue, useAnimatedProps } from 'react-native-reanimated';
import { format } from 'date-fns';
import { TimeBlock, Appointment } from '../types/Service';
import { useTimeBlockGestures } from '@/src/components/hooks/useTimeBlockGestures';
import { addDaysNumber } from '../utils/timeUtils';
import AppointmentBlock from './AppointmentBlock';


const MINUTES_PER_STEP = 15;
const MINUTES_IN_HOUR = 60;
const HOUR_HEIGHT = 60
const PIXELS_PER_MINUTE = HOUR_HEIGHT / MINUTES_IN_HOUR;
const MIN_DURATION = 15;
const MINUTES_IN_DAY = 1440;

const screenWidth = Dimensions.get('window').width;

// const AnimatedTextInput = createAnimatedComponent(TextInput);

interface DayColumnProps {
    selectedDate: number;
    selectedDateShared: SharedValue<number>;
    isCurrentDay?: boolean;
    centerListRef: AnimatedRef<Animated.ScrollView>;
    prevListRef: AnimatedRef<Animated.ScrollView>;
    nextListRef: AnimatedRef<Animated.ScrollView>
    position: 'prev' | 'center' | 'next';
    displayDateShared: DerivedValue<number>;
    scrollHandler?: any;
    onLeftRightScroll?: (e: any) => void;
    scrollOffset: SharedValue<number>
    // getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
    selectedTimeBlock: SharedValue<TimeBlock>;
    isMonthVisible: boolean;
    isModalVisible: SharedValue<boolean>;
    isSwiping: SharedValue<boolean>;
    previewDate: SharedValue<number | null>
    allGroupedAppointments: Record<number, Appointment[]>;
}


export const DayColumn: React.FC<DayColumnProps> = ({
    selectedDateShared, scrollHandler, selectedTimeBlock, position, 
    isMonthVisible, isModalVisible, scrollOffset, displayDateShared, allGroupedAppointments,
    prevListRef, centerListRef, nextListRef, isCurrentDay = false, selectedDate,previewDate
}) => {
    const appointmentTitle = "Appointment 1" // temporary marker

        // Date formatting logic for standard Text components
    const currentTimestamp = displayDateShared.value; 
    let dayNameString = 'ERR';
    let dayNumberString = 'ERR';

    if (currentTimestamp !== null && currentTimestamp !== undefined && !isNaN(currentTimestamp)) {
        try {
            const dateObj = new Date(currentTimestamp);
            dayNameString = format(dateObj, 'EEE');
            dayNumberString = format(dateObj, 'dd');
        } catch (e) {
            console.error("Error formatting date in DayColumn:", e);
            // dayNameString and dayNumberString remain 'ERR'
        }
    } else {
        // Handle null, undefined, or NaN timestamps if necessary, e.g., display placeholder
        dayNameString = currentTimestamp === null ? 'NUL' : currentTimestamp === undefined ? 'UND' : 'NaN';
        dayNumberString = dayNameString;
    }

    const ListHours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
   
    const dayColumnY = useSharedValue(0)

    const [isBlockRenderable, setIsBlockRenderable] = useState(false);
    const containerRef = useRef<View>(null);

    const initialStart = useSharedValue(0);
    const initialEnd = useSharedValue(0);
    const topInitialStart = useSharedValue(0);
    const bottomInitialEnd = useSharedValue(0);
    const initialOffset = 8 * 60;
    const height = useSharedValue(0);
    const startHeight = useSharedValue(height.value);

    const selectedTimestamp = useSharedValue(selectedDateShared.value)


    const { tapTimeBlockGesture, topResizeGesture, bottomResizeGesture, moveGesture 
    } = useTimeBlockGestures({ HOUR_HEIGHT, MINUTES_PER_STEP, PIXELS_PER_MINUTE, selectedDateShared,
        MIN_DURATION, MINUTES_IN_DAY, scrollOffset, selectedTimeBlock, 
        isMonthVisible, selectedTimestamp, isModalVisible, topInitialStart, bottomInitialEnd, 
        initialStart, initialEnd, height, startHeight, setIsBlockRenderable
    });

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);


    const dayNameProps = useAnimatedProps(() => {
        'worklet';
        const date = new Date(displayDateShared.value);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return { value: dayNames[date.getDay()] };
    });

    const dayNumberProps = useAnimatedProps(() => {
        'worklet';
        const date = new Date(displayDateShared.value);
        const day = date.getDate();
        return { value: day + '' };
    });


     useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                    dayColumnY.value = pageY;
                });
            }
            if (centerListRef.current) {
                centerListRef.current.scrollTo({ y: initialOffset, animated: false });
            }
        }, 0);
    }, []);



    useAnimatedReaction(() => {
        const block = selectedTimeBlock.value
        return block !== null && block.startMinutes !== null && block.endMinutes !== null;
    },(isRenderable) => {
        runOnJS(setIsBlockRenderable)(isRenderable);
    },[]);


    const appointmentBlockStyle = useAnimatedStyle(() => {
        const block = selectedTimeBlock.value;
        return {
            top: (block?.startMinutes ?? 0) * HOUR_HEIGHT / 60 - scrollOffset.value + dayColumnY.value,
            height: block.endMinutes && block.startMinutes ? (block.endMinutes - block.startMinutes) * HOUR_HEIGHT / 60 : 0,
        };
    });


    useAnimatedReaction(() => {
        const block = selectedTimeBlock.value
        return block !== null && block.startMinutes !== null && block.endMinutes !== null;
    },(isRenderable) => {
        runOnJS(setIsBlockRenderable)(isRenderable);
    },[]);


    // const [displayDate, setDisplayDate] = useState(selectedDateShared.value);

    // useAnimatedReaction(
    //     () =>  displayDateShared.value,
    //     (result, previous) => {
    //         if (result !== previous) {
    //         runOnJS(setDisplayDate)(result);
    //         }
    //     }
    // );


    const calculatePositionedAppointments = (appointments: any[], dateStartMs: number) => {
        return appointments.map(app => {
            const start = app.start_minutes;
            const end = app.end_minutes;
            const topOffset = Math.max(0, ((start - dateStartMs) / 60000 / 60) * HOUR_HEIGHT);
            const blockHeight = ((end - start) / 60000 / 60) * HOUR_HEIGHT;
            return {
                ...app,
                topOffset,
                blockHeight,
            };
        });
    };


    // const dateStartMs = new Date(displayDate).setHours(0, 0, 0, 0);
    const dateStartMs = useMemo(() => {
        const d = new Date(displayDateShared.value);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }, [displayDateShared.value]);

    const currentAppointments = useMemo(() => {
        return allGroupedAppointments[dateStartMs] || [];
    }, [allGroupedAppointments, dateStartMs])

    const positionedAppointments = useMemo(() =>
        calculatePositionedAppointments(currentAppointments, dateStartMs),
    [currentAppointments, dateStartMs]);



    return (
        <Animated.View 
            style={{ flex: 1 }} 
            pointerEvents="auto"
            ref={containerRef} 
            >
            {/* date header */}
            <View style={{flexDirection: "row", zIndex: 1}}>
                <View style={ isMonthVisible ? styles.dayContainerDefault : styles.dayContainerVisible }>
                    <Text style={styles.dayNumber}>{dayNameString}</Text>
                    <Text style={styles.dayNumber}>{dayNumberString}</Text>
                    {/* <AnimatedTextInput style={styles.dayNumber} animatedProps={dayNameProps} editable={false} /> */}
                    {/* <AnimatedTextInput style={styles.dayNumber} animatedProps={dayNumberProps} editable={false} /> */}
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                    <Text style={{ width: 300, paddingLeft: 30, fontSize: 16 }}>selectedDate:       {format(new Date(selectedDate), 'EEE dd MMM yyy')}</Text>
                    <Text style={{ width: 300, paddingLeft: 30, fontSize: 16 }}>selectedShared:   {format(new Date(selectedDateShared.value), 'EEE dd MMM yyy')}</Text>

                    {/* <Text style={{ width: 300, paddingLeft: 30, fontSize: 16 }}>TimeBlockDate:   {format(new Date(selectedTimeBlock.value.date), 'EEE dd MMM yyy')}</Text> */}
                </View>
            </View>

            <GestureDetector gesture={tapTimeBlockGesture}> 
                <View 
                    style={{position: 'relative', flex: 1}}
                    onLayout={(e) => {
                        const {y} = e.nativeEvent.layout;
                        dayColumnY.value = y
                    }}
                >
                    <Animated.ScrollView
                        ref={position === 'prev' ? prevListRef : position === 'center' ? centerListRef : nextListRef}
                        // keyExtractor={item => `${isCurrentDay ? 'curr' : isCurrentDay}-${item}`}
                        // data={ListHours}
                        bounces={true}
                        overScrollMode="always"
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        style={{ 
                            flex: 1, 
                            backgroundColor: position === 'prev' 
                            ? '#f0f8ff' : position === 'center'
                            ? '#e6ffe6' : '#ffe6f0',
                        }}
                    >
                        <View style={{ height: 24 * HOUR_HEIGHT, position: 'relative' }}>

                            {ListHours.map((hour) => (
                                <View
                                    key={`hour-${hour}`}
                                    style={{
                                        height: HOUR_HEIGHT,
                                        flexDirection: 'row',
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    <View>
                                        <Text style={styles.time}>{`${hour}:00`}</Text>
                                    </View>
                                    <View style={ styles.hourBlockDivider} />
                                    <View style={styles.hourBlock} />
                                </View>
                            ))}

                            {positionedAppointments.map(app => {
                                console.log(`DayColumn [${format(new Date(displayDateShared.value), 'EEE dd')}]: Rendering app: ${app.appointment_title} at top: ${app.topOffset}, height: ${app.blockHeight}, left: 62`);
                                return (
                                    <View
                                        key={app.appointmentId || app.start_minutes}
                                        style={{
                                            position: 'absolute',
                                            top: app.topOffset,
                                            height: app.blockHeight,
                                            backgroundColor: app.color,
                                            borderRadius: 7,
                                            padding: 7,
                                            left: 62,
                                            right: 5,
                                            zIndex: 10,
                                            borderWidth: 2,
                                            borderColor: 'red'
                                        }}
                                        >
                                        <Text>{app.appointment_title}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Animated.ScrollView>
                </View>
            </GestureDetector>

            {isBlockRenderable && (
                <Animated.View
                    pointerEvents="auto"
                    style={[styles.selectedTimeBlock, appointmentBlockStyle]}
                >
                    {/* Top edge drag zone */}
                    <GestureDetector gesture={topResizeGesture}>
                        <View style={styles.topResizeGesture }/>
                    </GestureDetector>

                    {/* Middle drag zone */}
                    <GestureDetector gesture={moveGesture}>
                        <View style={styles.moveGesture} >
                            <Text style={ styles.appointmentTitle}>{appointmentTitle}</Text>
                        </View>
                    </GestureDetector>

                    {/* Bottom edge drag zone */}
                    <GestureDetector gesture={bottomResizeGesture}>
                        <View style={styles.bottomResizeGesture }/>
                    </GestureDetector>
                </Animated.View>
            )}
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        // borderTopWidth: 1,
    },
    time: {
        textAlign: 'right', 
        fontWeight: '300', 
        width: 40, 
        marginTop: -9,
    },
    hourBlock: {
        flex: 5,  
        // borderBottomWidth: .5,
        borderTopWidth: .5,
        borderColor: '#eee',
        alignItems: 'stretch',
    },
    hourBlockDivider: {
        marginLeft: 10,
        width: 5, 
        borderRightWidth: 1,
        borderTopWidth: .5,
        borderBottomWidth: .5, 
        borderColor: '#eee' 
    },
    appointmentTitle: {
        height: 20,
        paddingLeft: 10
    },
    selectedTimeBlock: {
        position: 'absolute',
        left: 62,
        right: 5,
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        borderWidth: 3,
        borderColor: '#2196f3',
        borderRadius: 3,
    },
    moveGesture: {
        flex: 1, 
        justifyContent: 'center' ,
    },
    topResizeGesture: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', 
        zIndex: 10,
    },
    bottomResizeGesture:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', 
        zIndex: 10,
    },
    dayContainerVisible: {
        backgroundColor: "white",
        borderRadius: 2,
        // iOS shadow
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderBottomColor: 'grey',
        zIndex: 1,
        // Android shadow (elevation = spread + blur approximation)
        elevation: 4
    },
    dayContainerDefault:{
        backgroundColor: 'white',  
        borderBottomColor: '#eee', 
        borderBottomWidth: 1
    },
    dayName: {
        backgroundColor: "transparent",
        paddingTop: 7,
        paddingBottom: 3,
        width: 60,
        textAlign: 'center',
        fontSize: 12,
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        fontWeight: 500
    },
    dayNumber: {
        backgroundColor: "white",
        width: 60,
        textAlign: 'center',
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        paddingBottom: 3,
        fontWeight: 500
    },
    dateHeader: {
        height: 30,
        fontSize: 16,
        textAlign: 'center',
        padding: 4,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});

