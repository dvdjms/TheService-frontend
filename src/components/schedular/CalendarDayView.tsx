import React, { Dispatch, SetStateAction, forwardRef, useEffect, useImperativeHandle, useMemo  } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing, 
    SharedValue, useAnimatedRef, useAnimatedScrollHandler, scrollTo, useDerivedValue,
    runOnUI,
} from 'react-native-reanimated';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DayColumn } from './DayColumn';
import { addDaysNumber } from '../utils/timeUtils';
import { Appointment, CalendarDayViewHandle, TimeBlock } from '@/src/components/types/Service';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import dummyAppointments from "@/assets/mock-clients.json";


const screenWidth = Dimensions.get('window').width;

interface CalendarDayViewProps {
    selectedDate: number;
    selectedDateShared: SharedValue<number>;
    setSelectedDate: Dispatch<SetStateAction<number>>;
    isMonthVisible: boolean;
    isModalVisible:  SharedValue<boolean>;
    collapseMonth: () => void;
    selectedTimeBlock: SharedValue<TimeBlock>;
    previewDate: SharedValue<number | null>;
}

const CalendarDayView = forwardRef<CalendarDayViewHandle, CalendarDayViewProps>(({ 
    selectedDate, selectedDateShared, isMonthVisible, isModalVisible, collapseMonth, 
    selectedTimeBlock, setSelectedDate, previewDate
}, ref)  => {
    const centerListRef = useAnimatedRef<Animated.ScrollView>();
    const prevListRef = useAnimatedRef<Animated.ScrollView>();
    const nextListRef = useAnimatedRef<Animated.ScrollView>();
    
    const scrollOffset = useSharedValue(0);
    const isSwiping = useSharedValue(false);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const swipeThreshold = screenWidth * 0.25;
    const verticalThreshold = 60;
    const velocityThreshold = 500;
    const isContentReadyForSnap = useSharedValue(false); // Added for handshake


    //Exposes swipeToDate function to parent
    useImperativeHandle(ref, () => ({
        swipeToDateImpl: (targetDate: Date) => {
            swipeToDate(targetDate.getTime());
        }
    }));


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

    //swipe function referenced in CalendarMonthView
    const swipeToDate = (targetDate: number) => {
        const target = targetDate;

        if (selectedDateShared.value === target) return;

        const isForward = target > selectedDateShared.value;
        const directionMultiplier = isForward ? -1 : 1;

        isSwiping.value = true;
        previewDate.value = target;

        translateX.value = withTiming(
            directionMultiplier * screenWidth,
            { duration: 300, easing: Easing.out(Easing.ease) },
            (finished) => {
                'worklet';
                if (finished) {
                    selectedDateShared.value = targetDate;
                    runOnJS(setSelectedDate)(targetDate);
                    previewDate.value = null;
                    translateX.value = 0;
                    isSwiping.value = false;
                }
            }
        );
    };


    const prevDateShared = useDerivedValue(() => {
        return addDaysNumber(selectedDateShared.value, -1)
    });

    const centerDateShared = useDerivedValue(() => {
        return addDaysNumber(selectedDateShared.value, 0)
    });


    const nextDateShared = useDerivedValue(() => {
        return addDaysNumber(selectedDateShared.value, 1)
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
            transform: [{ translateX:  translateX.value - screenWidth }],
        };
    });

 
    const {panGesture, tapGesture } = useSwipeGestures({ selectedDateShared, isSwiping, isMonthVisible,
        screenWidth, previewDate, verticalThreshold, velocityThreshold, swipeThreshold, translateX, 
        translateY, collapseMonth, setSelectedDate,
    prevDateShared, centerDateShared, nextDateShared, isContentReadyForSnap
    });

    const sharedProps = {
        selectedDateShared,
        isMonthVisible,
        isModalVisible,
        selectedTimeBlock,
        scrollOffset,
        scrollHandler,
        prevListRef,
        centerListRef,
        nextListRef,
        selectedDate,
        isSwiping,
        previewDate
    }



    const normalizeToDayTimestamp = (ts: number) => {
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0); // midnight
        return d.getTime(); // timestamp at start of the day
    };

    const groupAppointmentsByDay = (appointments: any[]) => {
    return appointments.reduce((acc, app) => {
        const dateKey = normalizeToDayTimestamp(app.start_minutes);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(app);
        return acc;
    }, {} as Record<number, any[]>);
    };


    const groupedAppointments = useMemo(() => {
        const flatAppointments = dummyAppointments.flatMap(client => client.appointments);
        return groupAppointmentsByDay(flatAppointments);
    }, [dummyAppointments]);

    // // This is the correct way:
    // const appointmentsForPrev = useMemo(() => {
    //     const dayKey = normalizeToDayTimestamp(prevDateShared.value);
    //     return groupedAppointments[dayKey] || [];
    // }, [groupedAppointments, prevDateShared.value]);

    // const appointmentsForCenter = useMemo(() => {
    //     const dayKey = normalizeToDayTimestamp(centerDateShared.value);
    //     return groupedAppointments[dayKey] || [];
    // }, [groupedAppointments, centerDateShared.value]);

    // const appointmentsForNext = useMemo(() => {
    //     const dayKey = normalizeToDayTimestamp(nextDateShared.value);
    //     return groupedAppointments[dayKey] || [];
    // }, [groupedAppointments, nextDateShared.value]);
    useEffect(() => {
        // This effect runs after React has committed the selectedDate change
        // and DayColumns have had a chance to re-render with new appointments.
        runOnUI(() => {
            'worklet';
            // We only signal readiness if it was previously false.
            // The reaction on the UI thread will reset it to false after snapping.
            if (isContentReadyForSnap.value === false) {
                isContentReadyForSnap.value = true;
            }
        })();
    }, [selectedDate, isContentReadyForSnap]); 


    return (
        <GestureDetector gesture={Gesture.Exclusive(tapGesture, panGesture)}>
            <View 
                style={{ flex: 1, flexDirection: 'row', width: screenWidth * 3 }}
                pointerEvents={isMonthVisible ? "box-only" : "auto"}
            >
                <Animated.View style={[{width: screenWidth}, StyleSheet.absoluteFill, prevDayStyle]}>
                    <DayColumn 
                        // displayDate={prevDate}
                        displayDateShared={prevDateShared}
                        allGroupedAppointments={groupedAppointments}
                        position={'prev'}
                        {...sharedProps} />
                </Animated.View>
                <Animated.View style={[{width: screenWidth}, StyleSheet.absoluteFill, animatedStyle]}>
                    <DayColumn 
                        // displayDate={centerDate} 
                        displayDateShared={centerDateShared}
                        allGroupedAppointments={groupedAppointments}
                        position={'center'}
                        {...sharedProps} />
                </Animated.View>
                <Animated.View style={[{width: screenWidth}, StyleSheet.absoluteFill, nextDayStyle]}>
                    <DayColumn 
                        // displayDate={nextDate}
                        displayDateShared={nextDateShared}
                        allGroupedAppointments={groupedAppointments}
                        position={'next'} 
                        {...sharedProps} />
                </Animated.View>
            </View>
        </GestureDetector>
    );
})

export default CalendarDayView;
