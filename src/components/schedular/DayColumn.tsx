import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, AnimatedRef, runOnUI } from 'react-native-reanimated';
import { getTimeBlockFromY, TimeBlock } from '@/src/components/utils/timeBlockUtils';
import { format } from 'date-fns';

const MINUTES_PER_STEP = 15;
const MINUTES_IN_HOUR = 60;
const HOUR_HEIGHT = 60
const PIXELS_PER_MINUTE = HOUR_HEIGHT / MINUTES_IN_HOUR;

interface DayColumnProps {
    date: string;
    centerListRef: AnimatedRef<Animated.FlatList<number>>;
    prevListRef: AnimatedRef<Animated.FlatList<number>>;
    nextListRef: AnimatedRef<Animated.FlatList<number>>;
    position: 'prev' | 'center' | 'next';
    scrollHandler?: any;
    onLeftRightScroll?: (e: any) => void;
    scrollOffset: SharedValue<number>
    getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
    isCurrentDay?: boolean;
    selectedTimeBlock: SharedValue<TimeBlock>;
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
    isMonthVisible: boolean;
    currentDate: string;
}

export const DayColumn: React.FC<DayColumnProps> = ({
    date,
    centerListRef,
    prevListRef,
    nextListRef,
    position,
    scrollHandler,
    isCurrentDay = false,
    selectedTimeBlock,
    setIsModalVisible,
    isMonthVisible,
    currentDate,
    scrollOffset
}) => {
    const appointmentTitle = "Appointment 1" // temporary marker
    
    const MIN_DURATION = 15;
    const ListHours = Array.from({ length: 24 }, (_, i) => i);
    
    const [dayColumnY, setDayColumnY] = useState(0);
    const [isBlockRenderable, setIsBlockRenderable] = useState(false);
    const containerRef = useRef<View>(null);

    const initialStart = useSharedValue(0);
    const initialEnd = useSharedValue(0);
    const topInitialStart = useSharedValue(0);
    const bottomInitialEnd = useSharedValue(0);
    const initialOffset = 8 * 60;

    const height = useSharedValue(0);
    const startHeight = useSharedValue(height.value);


    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                    setDayColumnY(pageY);
                });
            }
            if (centerListRef.current) {
                centerListRef.current.scrollToOffset({ offset: initialOffset, animated: false });
            }
        }, 0);
    }, []);


    const animatedStyle = useAnimatedStyle(() => {
        const block = selectedTimeBlock.value;
        return {
            top: (block?.startMinutes ?? 0) * HOUR_HEIGHT / 60 - scrollOffset.value,
            height: block.endMinutes && block.startMinutes? (block.endMinutes - block.startMinutes) * HOUR_HEIGHT / 60 : 0,
        };
    });

    
    useAnimatedReaction(() => {
        const block = selectedTimeBlock.value
        return block !== null && block.startMinutes !== null && block.endMinutes !== null;
    },(isRenderable) => {
        runOnJS(setIsBlockRenderable)(isRenderable);
    },[]);


    const tapTimeBlockGesture = useMemo(() => 
        Gesture.Tap()
        .onEnd((e) => {
            'worklet';
            if (!isMonthVisible){
                const tappedY = e.absoluteY - dayColumnY + scrollOffset.value;
                const block = getTimeBlockFromY(tappedY, HOUR_HEIGHT, currentDate)
                // console.log("Tapped Y:", tappedY, "Block:", block);
                selectedTimeBlock.value = block;
                runOnJS(setIsModalVisible)(true);
            }
        }),[dayColumnY, isMonthVisible]
    );

    const snapToStep = (pixels: number) => {
        'worklet';
        const minutes = pixels / PIXELS_PER_MINUTE;
        const snappedMinutes = Math.round(minutes / MINUTES_PER_STEP) * MINUTES_PER_STEP;
        return snappedMinutes * PIXELS_PER_MINUTE;
    };

    const topResizeGesture = useMemo(() =>
        Gesture.Pan()
        .onBegin(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.startMinutes) return;
            topInitialStart.value = block.startMinutes;
        })
        .onUpdate(e => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.endMinutes || !block.startMinutes) return;

            const delta = Math.round((e.translationY * 60) / HOUR_HEIGHT);
            const newStart = topInitialStart.value + delta;

            // Clamp to not exceed end or go below 0
            if (newStart >= 0 && newStart <= block.endMinutes - MIN_DURATION) {
                selectedTimeBlock.value = {
                    startMinutes: newStart,
                    endMinutes: block.endMinutes,
                    date: currentDate
                };
            }

        })
        .onEnd(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.startMinutes) return;

            const snappedStart = snapToStep(block.startMinutes);
            selectedTimeBlock.value = {
                startMinutes: snappedStart,
                endMinutes: block.endMinutes,
                date: currentDate,
        }}),[HOUR_HEIGHT, selectedTimeBlock, currentDate]
    );


    const bottomResizeGesture = useMemo(() =>
        Gesture.Pan()
        .onBegin(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.endMinutes) return;
            bottomInitialEnd.value = block.endMinutes;
        })
        .onUpdate(e => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.startMinutes) return;

            const delta = Math.round((e.translationY * 60) / HOUR_HEIGHT);
            const newEnd = bottomInitialEnd.value + delta;

            // Clamp to not go below start or exceed 1440 (end of day)
            if (newEnd <= 1440 && newEnd >= block.startMinutes + MIN_DURATION) {
                selectedTimeBlock.value = {
                    startMinutes: block.startMinutes,
                    endMinutes: newEnd,
                    date: currentDate,
                };
            }
        }) .onEnd(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.endMinutes) return;

            const snappedEnd = snapToStep(block.endMinutes);
            selectedTimeBlock.value = {
                startMinutes: block.startMinutes,
                endMinutes: snappedEnd,
                date: currentDate,
            };
        }),[HOUR_HEIGHT, selectedTimeBlock, currentDate]
    );
    

    const moveGesture = useMemo(() => {
        return Gesture.Pan()
        .onStart(() => {
            startHeight.value = height.value;
        })
        .onBegin(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block.startMinutes || !block.endMinutes) return;

            initialStart.value = block.startMinutes;
            initialEnd.value = block.endMinutes;
        })
        .onUpdate(e => {
            'worklet';
            const offsetMinutes = Math.round((e.translationY * 60) / HOUR_HEIGHT);

            const newStart = initialStart.value + offsetMinutes;
            const newEnd = initialEnd.value + offsetMinutes;

            if (newStart >= 0 && newEnd <= 1440) {
                selectedTimeBlock.value = {
                    startMinutes: newStart,
                    endMinutes: newEnd,
                    date: currentDate,
                };
            }
        }).onEnd(() => {
            'worklet';
            if (!selectedTimeBlock.value.startMinutes || !selectedTimeBlock.value.endMinutes) return;

            const snappedStart = snapToStep(selectedTimeBlock.value.startMinutes);
            const snappedEnd = snapToStep(selectedTimeBlock.value.endMinutes);

            selectedTimeBlock.value = {
                startMinutes: snappedStart,
                endMinutes: snappedEnd,
                date: currentDate,
            };
        })
    }, [HOUR_HEIGHT, selectedTimeBlock, currentDate]);


    return (
            <View 
                style={{ flex: 1 }} 
                // collapsable={true} 
                pointerEvents="auto"
                ref={containerRef} 
                >

                <View style={ isMonthVisible ? styles.dayContainer2 : styles.dayContainer}>
                    <Text style={ styles.dayName }>{format(date, 'EEE' ).toUpperCase()}</Text>
                    <Text style={ styles.dayNumber }>{format(date, 'dd')}</Text>
                </View>

                <GestureDetector gesture={tapTimeBlockGesture}> 
                    <Animated.FlatList
                        ref={position === 'prev' ? prevListRef : position === 'center' ? centerListRef : nextListRef}
                        data={ListHours}
                        keyExtractor={item => `${isCurrentDay ? 'curr' : isCurrentDay}-${item}`}
        
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        style={{ flex: 1, backgroundColor: '#fff' }}
    
                        getItemLayout={(_, index) => ({
                            length: 60,
                            offset: 60 * index,
                            index,
                        })}

                        renderItem={({ item: hour }) => {
                            return (
                                <Animated.View
                                    style={{
                                        height: HOUR_HEIGHT,
                                        justifyContent: 'center',
                                        paddingHorizontal: 10,
                                        flex: 1,
                                        flexDirection: "row"
                                    }}
                                >
                                    <View style={ styles.timeContainer}>
                                        <Text style={styles.time}>{`${hour}:00`}</Text>
                                    </View>
                                    <View style={ styles.hourBlockDivider} />

                                    <View style={ styles.hourBlock}>
                                        {/* <Text>{date}</Text> */}
                                    </View>
                                </Animated.View>
                            );
                        }}
                    />
                </GestureDetector>

                {isBlockRenderable && (
                    <Animated.View
                        pointerEvents="auto"
                        style={[styles.selectedTimeBlock, animatedStyle]}
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
            </View>
    );
};


const styles = StyleSheet.create({
    timeContainer: {
        // flex: 1,
    },
    time: {
        textAlign: 'right', 
        fontWeight: '300', 
        width: 40, 
        marginTop: -9,
    },
    hourBlock: {
        flex: 5,  
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'stretch' 
    },
    hourBlockDivider: {
        marginLeft: 5,
        width: 5, 
        borderRightWidth: 1, 
        borderBottomWidth: 1, 
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

        container: {
        flex: 1,
    },
    dayContainer: {
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
    dayContainer2:{
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

