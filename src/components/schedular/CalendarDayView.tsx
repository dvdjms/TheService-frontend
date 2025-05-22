import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle,
    withTiming,
    runOnJS,
    Easing,
    useAnimatedReaction
} from 'react-native-reanimated';
import {
    FlatList,
    View,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { DayColumn } from './DayColumn';
import { TimeBlock } from '@/src/app/(auth)/(signed-in)/(tabs)/schedular';

const screenWidth = Dimensions.get('window').width;

interface CalendarDayViewProps {
    currentDate: string;
    isMonthVisible: boolean;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    collapseMonth: () => void;
    selectedHour: number | null;
    setSelectedHour: Dispatch<SetStateAction<number | null>>;
    selectedTimeBlock: TimeBlock | null;
    setSelectedTimeBlock: React.Dispatch<React.SetStateAction<TimeBlock | null>>; 
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
    HOUR_HEIGHT: number;
}

export default function CalendarDayView({ 
    currentDate, 
    isMonthVisible, 
    onSwipeLeft, 
    onSwipeRight, 
    collapseMonth,
    selectedHour,
    setSelectedHour,
    selectedTimeBlock,
    setSelectedTimeBlock,
    setIsModalVisible,
    HOUR_HEIGHT,
}: CalendarDayViewProps) {



    const centerListRef = useRef<FlatList<number>>(null);
    const prevListRef = useRef<FlatList<number>>(null);
    const nextListRef = useRef<FlatList<number>>(null);

    const [displayDate, setDisplayDate] = useState(currentDate);
    const [nextDate, setNextDate] = useState('');
    const [prevDate, setPrevDate] = useState('');

    const [scrollOffset, setScrollOffset] = useState(8 * HOUR_HEIGHT);
    const [isSwipingState, setIsSwipingState] = useState(false);
    
    const isSwiping = useSharedValue(false);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
  
    useAnimatedReaction(
        () => isSwiping.value,
        (swiping) => {
            runOnJS(setIsSwipingState)(swiping);
        }
    );
    
    useEffect(() => {
        const date = new Date(currentDate);
        setDisplayDate(currentDate);

        setNextDate(new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0]);
        setPrevDate(new Date(date.setDate(date.getDate() - 2)).toISOString().split('T')[0]);

        setTimeout(() => {
            centerListRef.current?.scrollToOffset({ offset: scrollOffset, animated: false });
            prevListRef.current?.scrollToOffset({ offset: scrollOffset, animated: false });
            nextListRef.current?.scrollToOffset({ offset: scrollOffset, animated: false });
        }, 50);
    }, [currentDate]);

    
    // Swipe left or right for next or previous day, swipe up to close month
    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isSwiping.value = true;
        })
        .onUpdate((e) => {
            if (isMonthVisible && Math.abs(e.translationX) > Math.abs(e.translationY)) {
                translateY.value = e.translationY;
                translateX.value = 0;
            } else {
                 translateX.value = e.translationX;
            }
        })
        .onEnd((e) => {
            const swipeThreshold = screenWidth * 0.25;
            const verticalThreshold = 60;
            const velocityThreshold = 500;

            // Vertical swipe up
            if (isMonthVisible && e.translationY < -verticalThreshold || e.velocityY < -velocityThreshold) {
                runOnJS(collapseMonth)();
                return;
            } 
            // Swipe right (go to previous day)
            else if (e.translationX > swipeThreshold || e.velocityX > velocityThreshold) {
                translateX.value = withTiming(
                    screenWidth,
                    { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                    (finished) => {
                        'worklet';
                        if (finished) {
                            runOnJS(onSwipeRight)();
                            translateX.value = 0;
                            isSwiping.value = false;
                        }
                    }
                );
            } 
            // Swipe left (go to next day)
            else if (e.translationX < -swipeThreshold || e.velocityX < -velocityThreshold) {
                translateX.value = withTiming(
                    -screenWidth,
                    { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                    (finished) => {
                        'worklet';
                        if (finished) {
                            runOnJS(onSwipeLeft)();
                            translateX.value = 0;
                            isSwiping.value = false;
                        }
                    }
                );
            }    
            else {
                translateX.value = withTiming(0, { duration: 200 });
                translateY.value = withTiming(0, { duration: 200 });
                isSwiping.value = false;
            }
        }
    );

    // closes Month on tap
    const tapGesture = Gesture.Tap()
        .enabled(isMonthVisible)
        .onEnd(() => {
            runOnJS(collapseMonth)();
    });


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const nextDayStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value + screenWidth }],
        };
    });

    const prevDayStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value - screenWidth }],
        };
    });

    // Track scroll position changes
    const handleLeftRightScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = e.nativeEvent.contentOffset.y;
        setScrollOffset(offset); // Save current scroll position
        
        // Sync other lists
        prevListRef.current?.scrollToOffset({ offset, animated: false });
        nextListRef.current?.scrollToOffset({ offset, animated: false });
    };

    return (
        <GestureDetector gesture={Gesture.Exclusive(tapGesture, panGesture)}>
            <View 
                style={{ flex: 1, overflow: 'hidden' }} 
                pointerEvents={isMonthVisible ? "box-only" : "auto"}
            >
                {/* Previous Day (left) */}
                <Animated.View style={[StyleSheet.absoluteFill, prevDayStyle]}>
                    <DayColumn
                        date={prevDate}
                        listRef={prevListRef}
                        setIsModalVisible={setIsModalVisible}
                        HOUR_HEIGHT={HOUR_HEIGHT}
                        isSwipingState={!isSwipingState}
                        isMonthVisible={isMonthVisible}
                        setSelectedHour={setSelectedHour}
                        selectedTimeBlock={selectedTimeBlock}
                        setSelectedTimeBlock={setSelectedTimeBlock}
                    />
                </Animated.View>

                <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                    <DayColumn
                        date={displayDate}
                        listRef={centerListRef}
                        isCurrentDay
                        selectedHour={selectedHour}
                        onHourPress={(hour: any) => {
                            if(!isMonthVisible){
                                setSelectedHour(hour);
                                setIsModalVisible(true);
                            }
                        }}
                        onLeftRightScroll={handleLeftRightScroll}
                        setIsModalVisible={setIsModalVisible}
                        HOUR_HEIGHT={HOUR_HEIGHT}
                        isSwipingState={!isSwipingState}
                        isMonthVisible={isMonthVisible}
                        setSelectedHour={setSelectedHour}
                        selectedTimeBlock={selectedTimeBlock}
                        setSelectedTimeBlock={setSelectedTimeBlock}
                    />
                </Animated.View>

                <Animated.View style={[StyleSheet.absoluteFill, nextDayStyle]}>
                    <DayColumn
                        date={nextDate}
                        listRef={nextListRef}
                        setIsModalVisible={setIsModalVisible}
                        HOUR_HEIGHT={HOUR_HEIGHT}
                        isSwipingState={isSwipingState}
                        isMonthVisible={isMonthVisible}
                        setSelectedHour={setSelectedHour}
                        selectedTimeBlock={selectedTimeBlock}
                        setSelectedTimeBlock={setSelectedTimeBlock}
                    />
                </Animated.View>

            </View>
        </GestureDetector>
    );
}
