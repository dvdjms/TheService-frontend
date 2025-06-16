import React, { Dispatch, SetStateAction, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState  } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, SharedValue, runOnUI, DerivedValue} from 'react-native-reanimated';
import { View, Dimensions, LayoutChangeEvent } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { FlashList as FlashListType } from "@shopify/flash-list";
import { DayColumn } from './DayColumn';
import { addDaysNumber } from '../utils/timeUtils';
import { CalendarDayViewHandle, TimeBlock } from '@/src/components/types/Service';
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
    isModalExpanded: SharedValue<boolean>;
    dynamicModalPadding: DerivedValue<0 | 170 | 50>
}

const CalendarDayView = forwardRef<CalendarDayViewHandle, CalendarDayViewProps>(({ 
    selectedDate, selectedDateShared, isMonthVisible, isModalVisible, isModalExpanded, collapseMonth, 
    selectedTimeBlock, setSelectedDate, previewDate, dynamicModalPadding
}, ref)  => {
    const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 }); // Restored

    const flashListRef = useRef<FlashListType<number>>(null);
    const isSwiping = useSharedValue(false);

    const EIGHT_AM_OFFSET = 8 * 60;
    const masterScrollOffsetY = useSharedValue(EIGHT_AM_OFFSET);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const swipeThreshold = screenWidth * 0.25;
    const verticalThreshold = 60;
    const velocityThreshold = 500;
    const isContentReadyForSnap = useSharedValue(false); // Added for handshake

 
    const {panGesture, tapGesture } = useSwipeGestures({ selectedDateShared, isSwiping, isMonthVisible,
        screenWidth, previewDate, verticalThreshold, velocityThreshold, swipeThreshold, translateX, 
        translateY, collapseMonth, setSelectedDate, isContentReadyForSnap
    });


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
    }, []);


    useEffect(() => {
        runOnUI(() => {
            'worklet';
            isContentReadyForSnap.value = true;
        })();
    }, [selectedDate]); 


    // Scroll to date when selectedDate changes externally
    // useEffect(() => {
    //     if (!flashListRef.current || isScrolling.value) return;
        
    //     const index = dates.findIndex(date => date === selectedDate);
    //     if (index >= 0) {
    //         flashListRef.current.scrollToIndex({
    //             index,
    //             animated: true,
    //             viewPosition: 0.5 // Center the item
    //         });
    //     }
    // }, [selectedDate, dates]);

    const dates = useMemo(() => {
        const days = [];
            for (let i = -30; i <= 30; i++) {
                days.push(addDaysNumber(selectedDate, i));
            }
            return days;
    }, [selectedDate]);


    const initialScrollIndex = useMemo(() => {
        return dates.findIndex(date => date === selectedDate);
    }, [dates, selectedDate]);


    // Correct definition of onLayoutView within the component scope
    const onLayoutView = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0) {
            if (layoutSize.width !== width || layoutSize.height !== height) {
                setLayoutSize({ width, height });
            }
        }
    }, [layoutSize.width, layoutSize.height]);


    const sharedProps = {
        selectedDateShared,
        isMonthVisible,
        isModalVisible,
        selectedTimeBlock,
        selectedDate,
        masterScrollOffsetY,
        dynamicModalPadding,
        isModalExpanded,
    }


    return (
        // <GestureDetector gesture={Gesture.Exclusive(tapGesture, panGesture)}>
        <GestureDetector gesture={Gesture.Exclusive(tapGesture)}>
            <View 
                style={{ flex: 1}}
                pointerEvents={isMonthVisible ? "box-only" : "auto"}
                onLayout={onLayoutView}
            >
                {layoutSize.width > 0 && layoutSize.height > 0 ? (
                // {shouldRenderFlashList ? (
                <FlashList
                    ref={flashListRef}
                    data={dates}
                    renderItem={({ item }) => {
                        return (
                            <DayColumn 
                                dateTimestamp={item} 
                                allGroupedAppointments={groupedAppointments} 
                                itemActualHeight={layoutSize.height} 
                                itemActualWidth={layoutSize.width} 
                                {...sharedProps} />
                        )
                    }}
                    estimatedItemSize={screenWidth}
                    horizontal
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.toString()}
                    getItemType={() => 'day'}
                    initialScrollIndex={initialScrollIndex}
                    scrollEventThrottle={16}
                    snapToInterval={screenWidth}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingBottom: isModalVisible.value ? (isModalExpanded.value ? 170 : 50) : 0 }}
                />
                ): null}
     
            </View>
        </GestureDetector>
    );
})

export default CalendarDayView;



    //Exposes swipeToDate function to parent
    // useImperativeHandle(ref, () => ({
    //     swipeToDateImpl: (targetDate: Date) => {
    //         swipeToDate(targetDate.getTime());
    //     }
    // }));




    //swipe function referenced in CalendarMonthView
    // const swipeToDate = (targetDate: number) => {
    //     const target = targetDate;

    //     if (selectedDateShared.value === target) return;

    //     const isForward = target > selectedDateShared.value;
    //     const directionMultiplier = isForward ? -1 : 1;

    //     isSwiping.value = true;
    //     previewDate.value = target;

    //     translateX.value = withTiming(
    //         directionMultiplier * screenWidth,
    //         { duration: 300, easing: Easing.out(Easing.ease) },
    //         (finished) => {
    //             'worklet';
    //             if (finished) {
    //                 selectedDateShared.value = targetDate;
    //                 previewDate.value = null;
    //                 runOnJS(setSelectedDate)(targetDate);
    //                 translateX.value = 0;
    //                 isSwiping.value = false;
    //             }
    //         }
    //     );
    // };