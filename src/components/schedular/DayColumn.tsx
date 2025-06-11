import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, 
    useSharedValue, runOnUI, scrollTo, useAnimatedRef, useAnimatedScrollHandler
    } from 'react-native-reanimated';
import { TimeBlock, Appointment } from '../types/Service';
import { useTimeBlockGestures } from '@/src/components/hooks/useTimeBlockGestures';
import HourGrid from '@/src/components/schedular/HourGrid';
import DateHeader from '@/src/components/schedular/DateHeader';
import AppointmentBlocks from './AppointmentBlocks';
import SelectedTimeBlock from './SelectedTimeBlock';
import { usePositionedAppointments } from '../hooks/usePositionedAppointments';


const MINUTES_PER_STEP = 15;
const MINUTES_IN_HOUR = 60;
const HOUR_HEIGHT = 60
const PIXELS_PER_MINUTE = HOUR_HEIGHT / MINUTES_IN_HOUR;
const MIN_DURATION = 15;
const MINUTES_IN_DAY = 1440;

interface DayColumnProps {
    selectedDate: number;
    selectedDateShared: SharedValue<number>;
    dateTimestamp: number;
    scrollOffset: SharedValue<number>
    selectedTimeBlock: SharedValue<TimeBlock>;
    isMonthVisible: boolean;
    isModalVisible: SharedValue<boolean>;
    allGroupedAppointments: Record<number, Appointment[]>;
    itemActualHeight: number;
    itemActualWidth: number;
    masterScrollOffsetY: SharedValue<number>
}


export const DayColumn: React.FC<DayColumnProps> = ({
    selectedDateShared, selectedTimeBlock, masterScrollOffsetY,
    isMonthVisible, isModalVisible, scrollOffset, allGroupedAppointments,
    dateTimestamp, itemActualHeight, itemActualWidth
}) => {

    const appointmentTitle = "Appointment 1" // temporary marker

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
    const isUserDraggingThisColumn = useSharedValue(false);


    const { tapTimeBlockGesture, topResizeGesture, bottomResizeGesture, moveGesture 
    } = useTimeBlockGestures({ HOUR_HEIGHT, MINUTES_PER_STEP, PIXELS_PER_MINUTE, selectedDateShared,
        MIN_DURATION, MINUTES_IN_DAY, scrollOffset, selectedTimeBlock, isMonthVisible, 
        isModalVisible, topInitialStart, bottomInitialEnd, initialStart, 
        initialEnd, height, startHeight, setIsBlockRenderable
    });


    const [displayDate, setDisplayDate] = useState<number>(dateTimestamp);
    const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
    const initialScrollPixels = useMemo(() => (8 * 60) * PIXELS_PER_MINUTE, []);

    useEffect(() => {
        if (dateTimestamp !== displayDate) {
            setDisplayDate(dateTimestamp);
        }
    }, [dateTimestamp, displayDate]);


    const [hasPerformedInitialScrollLogic, setHasPerformedInitialScrollLogic] = useState(false);

    useEffect(() => {
        if (!hasPerformedInitialScrollLogic) {
            const targetY = masterScrollOffsetY.value > 1 ? masterScrollOffsetY.value : initialScrollPixels;
            runOnUI(() => {
                'worklet';
                if (scrollViewRef.current) {
                    scrollTo(scrollViewRef, 0, targetY, false);
                }
            })();
            setHasPerformedInitialScrollLogic(true);
        }
    }, [initialScrollPixels, masterScrollOffsetY, hasPerformedInitialScrollLogic, dateTimestamp, scrollViewRef]);

    // Reaction to masterScrollOffsetY changes (runs on UI thread)
    useAnimatedReaction(
        () => masterScrollOffsetY.value,
        (currentMasterY, previousMasterY) => {
            'worklet';
            if (currentMasterY !== previousMasterY && scrollViewRef.current) {
                if (!isUserDraggingThisColumn.value) { // <<< THE CRUCIAL CHECK
                    scrollTo(scrollViewRef, 0, currentMasterY, false);
                } else {
                }
            }
        },
        [masterScrollOffsetY, scrollViewRef, dateTimestamp] 
    );


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


    const positionedAppointments = usePositionedAppointments(displayDate, allGroupedAppointments);

    const internalScrollHandler = useAnimatedScrollHandler({
        onBeginDrag: (event, context) => {
            'worklet';
            isUserDraggingThisColumn.value = true;
        },
        onEndDrag: (event) => {
            'worklet';
            masterScrollOffsetY.value = event.contentOffset.y;
            isUserDraggingThisColumn.value = false;
        },
        onMomentumEnd: (event) => {
            'worklet';
            masterScrollOffsetY.value = event.contentOffset.y;
            isUserDraggingThisColumn.value = false;
        },
    });
    
    return (
        <View 
            style={{ height: itemActualHeight, width: itemActualWidth}} 
            pointerEvents="auto"
            ref={containerRef} 
            >

            <DateHeader isMonthVisible={isMonthVisible} displayDate={displayDate} selectedDate={displayDate}/>
            
            
            <GestureDetector gesture={tapTimeBlockGesture}> 
                <View 
                    style={{position: 'relative', flex: 1 }}
                    onLayout={(e) => {
                        const {y} = e.nativeEvent.layout;
                        dayColumnY.value = y
                    }}
                >
                    <Animated.ScrollView
                        ref={scrollViewRef}
                        bounces={true}
                        overScrollMode="always"
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        onScroll={internalScrollHandler}
                        style={{ 
                            flex: 1, 
                            backgroundColor: '#fff',
                        }}
                    >
                        <View style={{ height: 24 * HOUR_HEIGHT, position: 'relative' }}>
                            <HourGrid />
                            <AppointmentBlocks appointments={positionedAppointments} />
                        </View>
                    </Animated.ScrollView>
                </View>
            </GestureDetector>

            <SelectedTimeBlock
                isBlockRenderable={isBlockRenderable}
                appointmentBlockStyle={appointmentBlockStyle}
                topResizeGesture={topResizeGesture}
                moveGesture={moveGesture}
                bottomResizeGesture={bottomResizeGesture}
                appointmentTitle={appointmentTitle}
            />
        </View>
    );
};
