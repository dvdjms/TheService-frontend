import React, { Dispatch, SetStateAction, forwardRef, useImperativeHandle  } from 'react';
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
    useDerivedValue
} from 'react-native-reanimated';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { DayColumn } from './DayColumn';
import { useAdjacentDatesNumber } from '../utils/timeUtils';
import { CalendarDayViewHandle, TimeBlock } from '@/src/components/types/Service';
import { useSwipeGestures } from '../hooks/useSwipeGestures';

// import { TimeBlock } from '@/src/types/Service';

const screenWidth = Dimensions.get('window').width;
type Appointment = {
  id: string;
  appointment_title: string;
  date: string;
  startMinutes: string;
  endMinutes: string;
};



interface CalendarDayViewProps {
    currentDate: Date;
    isMonthVisible: boolean;
    isModalVisible:  SharedValue<boolean>;
    goToNextDay: () => void;
    goToPreviousDay: () => void;
    collapseMonth: () => void;
    selectedTimeBlock: SharedValue<TimeBlock>;
    setCurrentDate: Dispatch<SetStateAction<Date>>;
    appointments: SharedValue<Appointment[]>;
}

const CalendarDayView = forwardRef<CalendarDayViewHandle, CalendarDayViewProps>(({ 
    currentDate, 
    isMonthVisible, 
    isModalVisible,
    goToNextDay, 
    goToPreviousDay, 
    collapseMonth,
    selectedTimeBlock,
    setCurrentDate,
}, ref)  => {
    const centerListRef = useAnimatedRef<Animated.FlatList<any>>();
    const prevListRef = useAnimatedRef<Animated.FlatList<any>>();
    const nextListRef = useAnimatedRef<Animated.FlatList<any>>();

    const scrollOffset = useSharedValue(0);
    const isSwiping = useSharedValue(false);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const currentTimestamp = useSharedValue(currentDate.getTime());
    const previewDate = useSharedValue(currentTimestamp.value);
    // const previewDate = useSharedValue(currentDate?.getTime());

    const swipeThreshold = screenWidth * 0.25;
    const verticalThreshold = 60;
    const velocityThreshold = 500;

    const { prevDate, nextDate } = useAdjacentDatesNumber(currentDate);

    const {
        panGesture,
        tapGesture,
    } = useSwipeGestures({
        isSwiping,
        isMonthVisible,
        screenWidth,
        prevDate,
        nextDate,
        previewDate,
        currentTimestamp,
        verticalThreshold,
        velocityThreshold,
        swipeThreshold,
        translateX,
        translateY,
        collapseMonth,
        goToNextDay,
        goToPreviousDay
     });


    const visibleDates = useDerivedValue(() => {
        return [
            // getISODateStringOffset(currentDateString, -1), // previous
            // currentDateString,
            // getISODateStringOffset(currentDateString, 1),  // next
        ];
    });


    // Exposes swipeToDate function to parent
    useImperativeHandle(ref, () => ({
        swipeToDateImpl: (targetDate: Date) => {
            swipeToDate((targetDate));
        }
    }));


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
    const swipeToDate = (targetDate: Date) => {
        const current = new Date(currentDate);
        const target = targetDate;

        const currentStr = current.toISOString().split('T')[0];
        const targetStr = target.toISOString().split('T')[0];
        if (currentStr === targetStr) return;

        const isForward = target > current;
        const directionMultiplier = isForward ? -1 : 1;

        isSwiping.value = true;
        previewDate.value = target.getTime();

        translateX.value = withTiming(
            directionMultiplier * screenWidth,
            { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
            (finished) => {
                'worklet';
                if (finished) {
                    runOnJS(handleSwipeToDateFinish)(targetStr);
                    translateX.value = 0;
                    isSwiping.value = false;
                }
            }
        );
    };

    const handleSwipeToDateFinish = (targetTimestamp: string) => {
        setCurrentDate(new Date(targetTimestamp));
    }


    const sharedProps = {
        isMonthVisible,
        isModalVisible,
        selectedTimeBlock,
        currentDate,
        scrollOffset,
        prevListRef,
        centerListRef,
        nextListRef,
        scrollHandler,
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
                        previewDate={new Date(previewDate.value)}
                        position={'prev'}
                        {...sharedProps}
                    />
                </Animated.View>

                {/* Center Day (main) */}
                <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                    
                    
                {/* {visibleDates.value.map((date) => (
                    <DayColumn 
                        key={date.toString()}
                        previewDate={currentDate}
                        appointments={appointment} 
                        position={'center'}
                        {...sharedProps}
                        />

                    ))} */}
                    
                    
                    <DayColumn
                        previewDate={currentDate}
                        position={'center'}
                        {...sharedProps}
                    />
                </Animated.View>

                {/* Next Day (right) */}
                <Animated.View style={[StyleSheet.absoluteFill, nextDayStyle]}>
                    <DayColumn
                        previewDate={new Date(previewDate.value)}
                        position={'next'}
                        {...sharedProps}
         
                    />
                </Animated.View>

            </View>
        </GestureDetector>
    );
})

export default CalendarDayView;
