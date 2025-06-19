import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, 
    runOnUI, scrollTo, useAnimatedRef, useAnimatedScrollHandler, DerivedValue,
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
    selectedTimeBlock: SharedValue<TimeBlock>;
    isMonthVisible: boolean;
    isModalVisible: SharedValue<boolean>;
    allGroupedAppointments: Record<number, Appointment[]>;
    itemActualHeight: number;
    itemActualWidth: number;
    masterScrollOffsetY: SharedValue<number>;
    dynamicModalPadding: DerivedValue<0 | 170 | 50>;
    isModalExpanded: SharedValue<boolean>;
}


export const DayColumn: React.FC<DayColumnProps> = ({
    selectedDateShared, selectedTimeBlock, masterScrollOffsetY,
    isMonthVisible, isModalVisible, allGroupedAppointments, isModalExpanded,
    dateTimestamp, itemActualHeight, itemActualWidth, dynamicModalPadding
}) => {

    const [isBlockRenderable, setIsBlockRenderable] = useState(false);
    const containerRef = useRef<View>(null);

    const initialStart = useSharedValue(0);
    const initialEnd = useSharedValue(0);
    const topInitialStart = useSharedValue(0);
    const bottomInitialEnd = useSharedValue(0);
    const height = useSharedValue(0);
    const startHeight = useSharedValue(height.value);
    const dayColumnY = useSharedValue(0)
    const isUserDraggingThisColumn = useSharedValue(false);

    const [displayDate, setDisplayDate] = useState<number>(dateTimestamp);
    const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
    const isTimeBlockTouched = useSharedValue(false);

    const { tapTimeBlockGesture, topResizeGesture, bottomResizeGesture, moveGesture 
    } = useTimeBlockGestures({ HOUR_HEIGHT, MINUTES_PER_STEP, PIXELS_PER_MINUTE, selectedDateShared,
        MIN_DURATION, MINUTES_IN_DAY, masterScrollOffsetY, selectedTimeBlock, isMonthVisible, 
        isModalVisible, topInitialStart, bottomInitialEnd, initialStart, isTimeBlockTouched,
        initialEnd, height, startHeight, setIsBlockRenderable, dateTimestamp, displayDate, isModalExpanded
    });


    useEffect(() => {
        if (dateTimestamp !== displayDate) {
            setDisplayDate(dateTimestamp);
        }
    }, [dateTimestamp]);


    useEffect(() => {
        const attemptScrollWorklet = () => {
            'worklet';
            if (scrollViewRef.current) {
                scrollTo(scrollViewRef, 0, masterScrollOffsetY.value, false); 
            }
        };
        runOnUI(attemptScrollWorklet)(); 

        const intervalId = setInterval(() => {
            if(scrollViewRef.current){
                scrollTo(scrollViewRef, 0, masterScrollOffsetY.value,false)
            }
        }, 100);

        return () => clearInterval(intervalId); 

    }, [masterScrollOffsetY, scrollViewRef, dateTimestamp]);



   // Reaction to masterScrollOffsetY changes (runs on UI thread)
    useAnimatedReaction(
        () => masterScrollOffsetY.value,
        (currentMasterY, previousMasterY) => {
            'worklet';
            if (currentMasterY !== previousMasterY) {
                if (!isUserDraggingThisColumn.value) {
                    scrollTo(scrollViewRef, 0, currentMasterY, false);
                }
            }
        },
        [masterScrollOffsetY, scrollViewRef, dateTimestamp, isUserDraggingThisColumn] 
    );

    
    useAnimatedReaction(() => {
        const block = selectedTimeBlock.value;
        return block !== null && 
                block.startMinutes !== null && 
                block.endMinutes !== null &&
                block.date === dateTimestamp;
    },(isRenderable) => {
        runOnJS(setIsBlockRenderable)(isRenderable);
    },[selectedTimeBlock, dateTimestamp]);


    const appointmentBlockStyle = useAnimatedStyle(() => {
        const block = selectedTimeBlock.value;
        const expand = isTimeBlockTouched.value ? 2 : 0;
        
        return {
            top: (block?.startMinutes ?? 0) * PIXELS_PER_MINUTE - masterScrollOffsetY.value + dayColumnY.value,
            height: block.endMinutes && block.startMinutes ? (block.endMinutes - block.startMinutes) * PIXELS_PER_MINUTE : 0,
            left: 62 - expand,
            right: 5 - expand,
        };
    });


    const positionedAppointments = usePositionedAppointments(displayDate, allGroupedAppointments);


    const internalScrollHandler = useAnimatedScrollHandler({
        onBeginDrag: (event, context) => {
            'worklet';
            isUserDraggingThisColumn.value = true;
        },
        onScroll: (event, context) => {
            'worklet';
            if (isUserDraggingThisColumn.value) {
                masterScrollOffsetY.value = event.contentOffset.y;
            }
        },
        onEndDrag: (event) => {
            'worklet';
            if (isUserDraggingThisColumn.value) { 
                masterScrollOffsetY.value = event.contentOffset.y;
            }
            //isUserDraggingThisColumn.value = false;
        },
        onMomentumBegin: (event, context) => {
            'worklet';
            if (isUserDraggingThisColumn.value) {
                masterScrollOffsetY.value = event.contentOffset.y;
            }
        },
        onMomentumEnd: (event) => {
            'worklet';
            if(isUserDraggingThisColumn.value){
                masterScrollOffsetY.value = event.contentOffset.y;
            }
            isUserDraggingThisColumn.value = false;
        },
    });
    

   // Define animatedPaddingViewStyle using the new dynamicModalPadding prop on dummy element
    const animatedPaddingViewStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            height: dynamicModalPadding.value,
        };
    }, [dynamicModalPadding]);


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
                        <Animated.View style={animatedPaddingViewStyle} />

                    </Animated.ScrollView>
                </View>
            </GestureDetector>

            <SelectedTimeBlock
                isBlockRenderable={isBlockRenderable}
                appointmentBlockStyle={appointmentBlockStyle}
                topResizeGesture={topResizeGesture}
                moveGesture={moveGesture}
                bottomResizeGesture={bottomResizeGesture}
            />
        </View>
    );
};
