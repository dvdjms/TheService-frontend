import React, { Dispatch, RefObject, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, View, Vibration, StyleSheet, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getTimeBlockFromY, TimeBlock } from '../utils/timeBlockUtils';

const MINUTES_PER_STEP = 15;
const MINUTES_IN_HOUR = 60;
const PIXELS_PER_MINUTE = 60 / MINUTES_IN_HOUR;

interface DayColumnProps {
    date: string;
    listRef: RefObject<FlatList<number> | null>;
    onLeftRightScroll?: (e: any) => void;
    getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
    isCurrentDay?: boolean;
    selectedTimeBlock: SharedValue<TimeBlock | null>;
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
    HOUR_HEIGHT: number;
    isSwipingState: boolean;
    isMonthVisible: boolean;
}

export const DayColumn: React.FC<DayColumnProps> = ({
    date,
    listRef,
    onLeftRightScroll,
    getItemLayout,
    isCurrentDay = false,
    selectedTimeBlock,
    setIsModalVisible,
    HOUR_HEIGHT,
    isSwipingState,
    isMonthVisible,
}) => {
    const appointmentTitle = "Appointment 1" // temporary marker
    
    const MIN_DURATION = 15;
    const ListHours = Array.from({ length: 24 }, (_, i) => i);
    
    const [dayColumnY, setDayColumnY] = useState(0);
    const [isBlockRenderable, setIsBlockRenderable] = useState(false);
    const containerRef = useRef<View>(null);

    const scrollOffset = useSharedValue(0);
    const initialStart = useSharedValue(0);
    const initialEnd = useSharedValue(0);
    const topInitialStart = useSharedValue(0);
    const bottomInitialEnd = useSharedValue(0);

    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                    setDayColumnY(pageY);
                });
            }
        }, 0);
    }, []);


    const animatedStyle = useAnimatedStyle(() => {
        const block = selectedTimeBlock.value;
        return {
            top: (block?.startMinutes ?? 0) * HOUR_HEIGHT / 60 - scrollOffset.value,
            height: block ? (block.endMinutes - block.startMinutes) * HOUR_HEIGHT / 60 : 0,
        };
    });

    
    useAnimatedReaction(() => {
        const block = selectedTimeBlock.value
        return block !== null && block.startMinutes !== null && block.endMinutes !== null;
    },(isRenderable) => {
        runOnJS(setIsBlockRenderable)(isRenderable);
    },[]);


    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        onLeftRightScroll?.(event);
        const yOffset = event.nativeEvent.contentOffset.y;
        scrollOffset.value = (yOffset)
    };

    const tapTimeBlockGesture = useMemo(() => 
        Gesture.Tap()
        .onEnd((e) => {
            'worklet';
            if (!isMonthVisible){
                const tappedY = e.absoluteY - dayColumnY + scrollOffset.value;
                const block = getTimeBlockFromY(tappedY, HOUR_HEIGHT)
                console.log("Tapped Y:", tappedY, "Block:", block);
                
                selectedTimeBlock.value = block;
                runOnJS(setIsModalVisible)(true);
                console.log({
                    absoluteY: e.absoluteY,
                    dayColumnY,
                    scrollOffset: scrollOffset.value,
                    tappedY,
                    block,
                });
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
            if (!block) return;
                topInitialStart.value = block.startMinutes;
        })
        .onUpdate(e => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block) return;

            const delta = Math.round((e.translationY * 60) / HOUR_HEIGHT);
            const newStart = topInitialStart.value + delta;

            // Clamp to not exceed end or go below 0
            if (newStart >= 0 && newStart <= block.endMinutes - MIN_DURATION) {
                selectedTimeBlock.value = {
                    startMinutes: newStart,
                    endMinutes: block.endMinutes,
                };
            }

        })
        .onEnd(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block) return;

            const snappedStart = snapToStep(block.startMinutes);
            selectedTimeBlock.value = {
                startMinutes: snappedStart,
                endMinutes: block.endMinutes,
        }}),[HOUR_HEIGHT, selectedTimeBlock]
    );


    const bottomResizeGesture = useMemo(() =>
        Gesture.Pan()
        .onBegin(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block) return;
            bottomInitialEnd.value = block.endMinutes;
        })
        .onUpdate(e => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block) return;

            const delta = Math.round((e.translationY * 60) / HOUR_HEIGHT);
            const newEnd = bottomInitialEnd.value + delta;

            // Clamp to not go below start or exceed 1440 (end of day)
            if (newEnd <= 1440 && newEnd >= block.startMinutes + MIN_DURATION) {
                selectedTimeBlock.value = {
                    startMinutes: block.startMinutes,
                    endMinutes: newEnd,
                };
            }
        }) .onEnd(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block) return;

            const snappedEnd = snapToStep(block.endMinutes);
            selectedTimeBlock.value = {
                startMinutes: block.startMinutes,
                endMinutes: snappedEnd,
            };
        }),[HOUR_HEIGHT, selectedTimeBlock]
    );
    


    const height = useSharedValue(0);
    const startHeight = useSharedValue(height.value);



    const moveGesture = useMemo(() => {
        return Gesture.Pan()
        .onStart(() => startHeight.value = height.value)
        .onBegin(() => {
            'worklet';
            const block = selectedTimeBlock.value;
            if (!block) return;

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
                };
            }
            console.log("selectedTimeBlock", selectedTimeBlock)
        }).onEnd(() => {
            'worklet';
            if (!selectedTimeBlock.value) return;

            const snappedStart = snapToStep(selectedTimeBlock.value.startMinutes);
            const snappedEnd = snapToStep(selectedTimeBlock.value.endMinutes);

            selectedTimeBlock.value = {
                startMinutes: snappedStart,
                endMinutes: snappedEnd,
            };
        })
    }, [HOUR_HEIGHT, selectedTimeBlock]);


    return (
            <View 
                style={{ flex: 1 }} 
                // collapsable={true} 
                pointerEvents="auto"
                ref={containerRef} 
                >
                <GestureDetector gesture={tapTimeBlockGesture}> 
                    <FlatList
                        ref={listRef}
                        data={ListHours}
                        keyExtractor={item => `${isCurrentDay ? 'curr' : date}-${item}`}
                        getItemLayout={getItemLayout}
                        onScroll={onScroll}
                        scrollEnabled={isSwipingState}
                        scrollEventThrottle={16}
                        style={{ flex: 1, backgroundColor: '#fff' }}
    
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
});
