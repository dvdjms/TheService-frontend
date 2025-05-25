import React, { Dispatch, SetStateAction, useState, forwardRef, useImperativeHandle  } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle,
    withTiming,
    runOnJS,
    Easing,
    SharedValue,
    useAnimatedRef,
    useAnimatedScrollHandler,
    scrollTo,
    useAnimatedReaction
} from 'react-native-reanimated';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { DayColumn } from './DayColumn';
import { TimeBlock, updateTimeBlockDate } from '@/src/components/utils/timeBlockUtils';
import { useAdjacentDates } from '../utils/timeUtils';

const screenWidth = Dimensions.get('window').width;


export type CalendarDayViewHandle = {
    swipeToDateImpl: (date: string) => void;
};

interface CalendarDayViewProps {
    currentDate: string;
    isMonthVisible: boolean;
    goToNextDay: () => void;
    goToPreviousDay: () => void;
    collapseMonth: () => void;
    selectedTimeBlock: SharedValue<TimeBlock>;
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
    setCurrentDate: Dispatch<SetStateAction<string>>;
}

const CalendarDayView = forwardRef<CalendarDayViewHandle, CalendarDayViewProps>(({ 
    currentDate, 
    isMonthVisible, 
    goToNextDay, 
    goToPreviousDay, 
    collapseMonth,
    selectedTimeBlock,
    setIsModalVisible,
    setCurrentDate
}, ref)  => {
    const centerListRef = useAnimatedRef<Animated.FlatList<any>>();
    const prevListRef = useAnimatedRef<Animated.FlatList<any>>();
    const nextListRef = useAnimatedRef<Animated.FlatList<any>>();

    const scrollOffset = useSharedValue(0);

    const isSwiping = useSharedValue(false);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const previewDateValue = useSharedValue(currentDate); 

    const [previewDate, setPreviewDate] = useState(currentDate);

    const swipeThreshold = screenWidth * 0.25;
    const verticalThreshold = 60;
    const velocityThreshold = 500;

    const { prevDate, nextDate } = useAdjacentDates(currentDate);


    // Exposes swipeToDate function to parent
    useImperativeHandle(ref, () => ({
        swipeToDateImpl: (targetDate: string) => {
            swipeToDate(targetDate);
        },
    }));


    // Sync the shared value to React state
    useAnimatedReaction(
        () => previewDateValue.value,
        (value, prev) => {
            if (value !== prev) {
                runOnJS(setPreviewDate)(value);
            }
        },[]
    );


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

            const previewThreshold = screenWidth * 0.01;

            if (Math.abs(e.translationX) > previewThreshold) {
                const newPreview = e.translationX > 0 ? prevDate : nextDate;
                // if (previewDateValue.value !== newPreview) {
                previewDateValue.value = newPreview;
            } else {
                 previewDateValue.value = currentDate
            }

        })
        .onEnd((e) => {
            // Vertical swipe up
            if (isMonthVisible && e.translationY < -verticalThreshold || e.velocityY < -velocityThreshold) {
                runOnJS(collapseMonth)();
                return;
            } 
            // Swipe right (go to previous day)
            else if (e.translationX > swipeThreshold || e.velocityX > velocityThreshold) {
                updateTimeBlockDate(selectedTimeBlock, prevDate);
                runOnJS(goToPreviousDay)();
                translateX.value = withTiming(
                    screenWidth,
                    { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                    (finished) => {
                        'worklet';
                        if (finished) {
                            translateX.value = 0;
                            isSwiping.value = false;
                        }
                    }
                );
            } 
            // Swipe left (go to next day)
            else if (e.translationX < -swipeThreshold || e.velocityX < -velocityThreshold) {
                updateTimeBlockDate(selectedTimeBlock, nextDate);
                runOnJS(goToNextDay)();
                translateX.value = withTiming(
                    -screenWidth,
                    { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                    (finished) => {
                        'worklet';
                        if (finished) {
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


    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const y = event.contentOffset.y;
            scrollOffset.value = y;

            if (prevListRef) {
                scrollTo(prevListRef, 0, y, false);
            }
            if (nextListRef) {
                scrollTo(nextListRef, 0, y, false);
            }
        },
    });

    // swipe function referenced in CalendarMonthView
    const swipeToDate = (targetDateString: string) => {
        const current = new Date(currentDate);
        const target = new Date(targetDateString);

        if (current.toISOString().split('T')[0] === target.toISOString().split('T')[0]) return;

        const isForward = target > current;
        const directionMultiplier = isForward ? -1 : 1;

        isSwiping.value = true;
        previewDateValue.value = targetDateString;

        translateX.value = withTiming(
            directionMultiplier * screenWidth,
            { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
            (finished) => {
                'worklet';
                if (finished) {
                    runOnJS(setCurrentDate)(targetDateString);
                    translateX.value = 0;
                    isSwiping.value = false;
                }
            }
        );
    };


    const sharedProps = {
        setIsModalVisible,
        isMonthVisible,
        selectedTimeBlock,
        currentDate,
        scrollOffset,
        prevListRef,
        centerListRef,
        nextListRef,
        scrollHandler
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
                        date={previewDate }
                        position={'prev'}
                        {...sharedProps}
                    />
                </Animated.View>

                {/* Center Day (main) */}
                <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                    <DayColumn
                        date={currentDate}
                        position={'center'}
                        {...sharedProps}
                    />
                </Animated.View>

                {/* Next Day (right) */}
                <Animated.View style={[StyleSheet.absoluteFill, nextDayStyle]}>
                    <DayColumn
                        // date={previewDate ? previewDate : nextDate }
                        date={previewDate }
                        position={'next'}
                        {...sharedProps}
                    />
                </Animated.View>

            </View>
        </GestureDetector>
    );
})

export default CalendarDayView;
