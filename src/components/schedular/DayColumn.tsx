import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, AnimatedRef, DerivedValue, useAnimatedScrollHandler, useAnimatedRef, useDerivedValue, useAnimatedProps } from 'react-native-reanimated';
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

interface DayColumnProps {
    selectedDate: number;
    selectedDateShared: SharedValue<number>;
    isCurrentDay?: boolean;
    centerListRef: AnimatedRef<Animated.FlatList<number>>;
    prevListRef: AnimatedRef<Animated.FlatList<number>>;
    nextListRef: AnimatedRef<Animated.FlatList<number>>
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
    appointments: Appointment[];
}

export const DayColumn: React.FC<DayColumnProps> = ({
    selectedDateShared, scrollHandler, selectedTimeBlock, position, 
    isMonthVisible, isModalVisible, scrollOffset, displayDateShared, appointments,
    prevListRef, centerListRef, nextListRef, isCurrentDay = false, selectedDate,previewDate
}) => {
    const appointmentTitle = "Appointment 1" // temporary marker


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


     useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                    dayColumnY.value = pageY;
                });
            }
            if (centerListRef.current) {
                centerListRef.current.scrollToOffset({ offset: initialOffset, animated: false });
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


    const [displayDate, setDisplayDate] = useState(selectedDateShared.value);

    useAnimatedReaction(
        () =>  displayDateShared.value,
        (result, previous) => {
            if (result !== previous) {
            runOnJS(setDisplayDate)(result);
            }
        }
    );


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


    const dateStartMs = new Date(displayDate).setHours(0, 0, 0, 0);

    const positionedAppointments = useMemo(() =>
        calculatePositionedAppointments(appointments, dateStartMs),
    [appointments, dateStartMs]);

    const appointmentsByHour = useMemo(() => {
        const grouped = {} as Record<number, typeof positionedAppointments>;
        for (const app of positionedAppointments) {
            const startHour = new Date(app.start_minutes).getHours();
            if (!grouped[startHour]) grouped[startHour] = [];
            grouped[startHour].push(app);
        }
        return grouped;
    }, [positionedAppointments]);


    return (
        <Animated.View 
            style={{ flex: 1 }} 
            pointerEvents="auto"
            ref={containerRef} 
            >
            {/* date header */}
            <View style={{flexDirection: "row", zIndex: 1}}>
                <View style={ isMonthVisible ? styles.dayContainerDefault : styles.dayContainerVisible }>
                    <Text style={ styles.dayNumber }>{format(new Date(displayDate), 'EEE')}</Text>
                    <Text style={ styles.dayNumber }>{format(new Date(displayDate), 'dd')}</Text>
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
                <Animated.FlatList
                    ref={position === 'prev' ? prevListRef : position === 'center' ? centerListRef : nextListRef}
                    keyExtractor={item => `${isCurrentDay ? 'curr' : isCurrentDay}-${item}`}
                    data={ListHours}
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

                    
                    // getItemLayout={(_, index) => ({
                    //     length: HOUR_HEIGHT,
                    //     offset: index * HOUR_HEIGHT,
                    //     index,
                    // })}

                    renderItem={({ item: hour }) => {
                        const blocks = appointmentsByHour[hour] || [];

                        return (
                            <View
                                style={{
                                    height: HOUR_HEIGHT,
                                    justifyContent: 'center',
                                    paddingHorizontal: 5,
                                    flex: 1,
                                    flexDirection: "row",
                                    // width: screenWidth
                                }}
                            >
                                <View >
                                    <Text style={styles.time}>{`${hour}:00`}</Text>
                                </View>
                                <View style={ styles.hourBlockDivider} />
                                    
                                {/* replace with below when rendering appointments */}
                                {/* <View style={ styles.hourBlock}> */}
                                    {/* <Text>{date}</Text> */}
                                {/* </View> */}

                                <View style={styles.hourBlock}>
                                {blocks.map(app => {
                                    return (
                                        <View
                                            key={app.start_minutes}
                                            style={{
                                                position: 'absolute',
                                                top: app.topOffset,
                                                height: app.blockHeight,
                                                backgroundColor: app.color,
                                                borderRadius: 7,
                                                padding: 7,
                                                left: 3,
                                                right: 2,
                                                zIndex: 1,
                                                borderWidth: 2,
                                                borderColor: 'red'
                                            }}
                                            >
                                            <Text>{app.appointment_title}</Text>
                                        </View>
                                    );
                                    })}
                                </View>
                            </View>
                        );
                    }}
                />
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

