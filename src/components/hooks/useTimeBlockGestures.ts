import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { useMemo } from 'react';
import { getTimeBlockFromY, snapToStep } from '@/src/components/utils/timeBlockUtils';
import { UseTimeBlockGesturesProps } from '@/src/components/types/Service';


export function useTimeBlockGestures(Props: UseTimeBlockGesturesProps) {const {  
    PIXELS_PER_MINUTE, MINUTES_PER_STEP, MIN_DURATION, MINUTES_IN_DAY, HOUR_HEIGHT,
    masterScrollOffsetY, selectedTimeBlock, isMonthVisible, selectedDateShared, dateTimestamp,displayDate,
    isModalVisible, topInitialStart, bottomInitialEnd, initialStart, initialEnd, height, startHeight
    } = Props;


    const tapTimeBlockGesture = useMemo(
        () =>
        Gesture.Tap().onEnd((e) => {
            'worklet';
            if (!isMonthVisible) {
                // const tappedY = e.y + masterScrollOffsetY.value;
                // const block = getTimeBlockFromY(tappedY, HOUR_HEIGHT, displayDate);

                const tapRelativeToScrollableTop = e.y;
                const tappedYInScrollContent = tapRelativeToScrollableTop + masterScrollOffsetY.value;

                const block = getTimeBlockFromY(tappedYInScrollContent, HOUR_HEIGHT, displayDate);
  
                selectedTimeBlock.value = block;
                isModalVisible.value = true;
            }
        }),
        [isMonthVisible, displayDate, masterScrollOffsetY, selectedTimeBlock, isModalVisible, HOUR_HEIGHT]
    );


    const topResizeGesture = useMemo(
        () =>
        Gesture.Pan()
            .onBegin(() => {
                'worklet';
                if(selectedTimeBlock.value.startMinutes)
                topInitialStart.value = selectedTimeBlock.value.startMinutes;
            })
            .onUpdate((e) => {
                'worklet';
                const delta = Math.round((e.translationY * 60) / HOUR_HEIGHT);
                const newStart = topInitialStart.value + delta;

                if(selectedTimeBlock.value.endMinutes)
                if (newStart >= 0 && newStart <= selectedTimeBlock.value.endMinutes - MIN_DURATION) {
                    selectedTimeBlock.value = {
                        ...selectedTimeBlock.value,
                        startMinutes: newStart,
                    };
                }
            })
            .onEnd(() => {
                'worklet';
                const snappedStart = snapToStep(selectedTimeBlock.value.startMinutes ? selectedTimeBlock.value.startMinutes : 0, PIXELS_PER_MINUTE, MINUTES_PER_STEP );
                selectedTimeBlock.value = {
                    ...selectedTimeBlock.value,
                    startMinutes: snappedStart,
                };
            }),
        [HOUR_HEIGHT, selectedTimeBlock, selectedDateShared.value]
    );


    const bottomResizeGesture = useMemo(
        () =>
        Gesture.Pan()
            .onBegin(() => {
            'worklet';
            if(selectedTimeBlock.value.endMinutes){
                bottomInitialEnd.value = selectedTimeBlock.value.endMinutes;
            }
            })
            .onUpdate((e) => {
            'worklet';
                const delta = Math.round((e.translationY * 60) / HOUR_HEIGHT);
                const newEnd = bottomInitialEnd.value + delta;
                if (selectedTimeBlock.value.startMinutes)
                if (newEnd <= MINUTES_IN_DAY && newEnd >= selectedTimeBlock.value.startMinutes + MIN_DURATION) {
                    selectedTimeBlock.value = {
                        ...selectedTimeBlock.value,
                        endMinutes: newEnd,
                    };
                }
            })
            .onEnd(() => {
                'worklet';
                const snappedEnd = snapToStep(selectedTimeBlock.value.endMinutes ? selectedTimeBlock.value.endMinutes : 0, PIXELS_PER_MINUTE, MINUTES_PER_STEP );
                selectedTimeBlock.value = {
                    ...selectedTimeBlock.value,
                    endMinutes: snappedEnd,
                };
            }),
        [HOUR_HEIGHT, selectedTimeBlock, selectedDateShared.value]
    );

    
    const moveGesture = useMemo(
        () =>
        Gesture.Pan()
            .onStart(() => {
                startHeight.value = height.value;
            })
            .onBegin(() => {
                'worklet';
                if(selectedTimeBlock.value.startMinutes)
                    initialStart.value = selectedTimeBlock.value.startMinutes;
                if(selectedTimeBlock.value.endMinutes)
                    initialEnd.value = selectedTimeBlock.value.endMinutes;
            })
            .onUpdate((e) => {
                'worklet';
                const offsetMinutes = Math.round((e.translationY * 60) / HOUR_HEIGHT);
                const newStart = initialStart.value + offsetMinutes;
                const newEnd = initialEnd.value + offsetMinutes;
                if (newStart >= 0 && newEnd <= MINUTES_IN_DAY) {
                    selectedTimeBlock.value = {
                        ...selectedTimeBlock.value,
                        startMinutes: newStart,
                        endMinutes: newEnd,
                    };
                }
            })
            .onEnd(() => {
                'worklet';
                const snappedStart = snapToStep(selectedTimeBlock.value.startMinutes ? selectedTimeBlock.value.startMinutes : 0, PIXELS_PER_MINUTE, MINUTES_PER_STEP );
                const snappedEnd = snapToStep(selectedTimeBlock.value.endMinutes ? selectedTimeBlock.value.endMinutes : 0, PIXELS_PER_MINUTE, MINUTES_PER_STEP );
                selectedTimeBlock.value = {
                    ...selectedTimeBlock.value,
                    startMinutes: snappedStart,
                    endMinutes: snappedEnd,
                };
            }),
        [HOUR_HEIGHT, selectedTimeBlock, selectedDateShared.value]
    );

    return {
        tapTimeBlockGesture,
        topResizeGesture,
        bottomResizeGesture,
        moveGesture,
    };
}
