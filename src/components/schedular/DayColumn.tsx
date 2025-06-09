import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, 
    useSharedValue, AnimatedRef, DerivedValue, 
    withTiming} from 'react-native-reanimated';
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
    isCurrentDay?: boolean;
    centerListRef: AnimatedRef<Animated.ScrollView>;
    prevListRef: AnimatedRef<Animated.ScrollView>;
    nextListRef: AnimatedRef<Animated.ScrollView>
    position: 'prev' | 'center' | 'next';
    displayDateShared: DerivedValue<number>;
    scrollHandler?: any;
    onLeftRightScroll?: (e: any) => void;
    scrollOffset: SharedValue<number>
    selectedTimeBlock: SharedValue<TimeBlock>;
    isMonthVisible: boolean;
    isModalVisible: SharedValue<boolean>;
    isSwiping: SharedValue<boolean>;
    previewDate: SharedValue<number | null>
    allGroupedAppointments: Record<number, Appointment[]>;
}


export const DayColumn: React.FC<DayColumnProps> = ({
    selectedDateShared, scrollHandler, selectedTimeBlock, position, 
    isMonthVisible, isModalVisible, scrollOffset, displayDateShared, allGroupedAppointments,
    prevListRef, centerListRef, nextListRef, isCurrentDay = false, selectedDate, previewDate
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


    // const [displayDate, setDisplayDate] = useState(displayDateShared.value);

    const { tapTimeBlockGesture, topResizeGesture, bottomResizeGesture, moveGesture 
    } = useTimeBlockGestures({ HOUR_HEIGHT, MINUTES_PER_STEP, PIXELS_PER_MINUTE, selectedDateShared,
        MIN_DURATION, MINUTES_IN_DAY, scrollOffset, selectedTimeBlock, isMonthVisible, 
        isModalVisible, topInitialStart, bottomInitialEnd, initialStart, 
        initialEnd, height, startHeight, setIsBlockRenderable
    });


    const [displayDate, setDisplayDate] = useState<number>(0);

    useAnimatedReaction(
        () => displayDateShared.value,
        (val) => {
            runOnJS(setDisplayDate)(val);
        }
    );

    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                    dayColumnY.value = pageY;
                });
            }
            if (centerListRef.current) {
                centerListRef.current.scrollTo({ y: initialOffset, animated: false });
            }
        }, 0);
    }, []);


    useAnimatedReaction(
        () => displayDateShared.value,
        (result, previous) => {
            if (result !== previous) {
              runOnJS(setDisplayDate)(result);
            }
        },
        // [displayDateShared]
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


    
    return (
        <Animated.View 
            style={{ flex: 1 }} 
            pointerEvents="auto"
            ref={containerRef} 
            >

            <DateHeader isMonthVisible={isMonthVisible} displayDate={displayDate} selectedDate={selectedDate}/>

            <GestureDetector gesture={tapTimeBlockGesture}> 
                <View 
                    style={{position: 'relative', flex: 1}}
                    onLayout={(e) => {
                        const {y} = e.nativeEvent.layout;
                        dayColumnY.value = y
                    }}
                >
                    <Animated.ScrollView
                        ref={position === 'prev' ? prevListRef : position === 'center' ? centerListRef : nextListRef}
                        bounces={true}
                        overScrollMode="always"
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        style={{ 
                            flex: 1, 
                            backgroundColor: '#fff' //position === 'prev' 
                           // ? '#f0f8ff' : position === 'center'
                           // ? '#e6ffe6' : '#ffe6f0',
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

        </Animated.View>
    );
};
