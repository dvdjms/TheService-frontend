// DayColumn.tsx (Unified Version)
import React, { Dispatch, RefObject, SetStateAction, useCallback, useMemo, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, LayoutChangeEvent, Vibration , StyleSheet, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { getTimeBlockFromY } from '../utils/timeBlockUtils';
import { TimeBlock } from '@/src/app/(auth)/(signed-in)/(tabs)/schedular';


interface DayColumnProps {
    date: string;
    listRef: RefObject<FlatList<number> | null>;
    onLeftRightScroll?: (e: any) => void;
    getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
    isCurrentDay?: boolean;
    selectedHour?: number | null;
    onHourPress?: (hour: number) => void;
    selectedTimeBlock: TimeBlock | null;
    setSelectedTimeBlock: React.Dispatch<React.SetStateAction<TimeBlock | null>>; 
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
    setSelectedHour: Dispatch<SetStateAction<number | null>>;
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
    selectedHour,
    onHourPress,
    selectedTimeBlock,
    setSelectedTimeBlock,
    setIsModalVisible,
    setSelectedHour,
    HOUR_HEIGHT,
    isSwipingState,
    isMonthVisible,
}) => {
    const appointmentTitle = "Appointment 1" // temporary marker
    const [dayColumnY, setDayColumnY] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);
    const ListHours = Array.from({ length: 24 }, (_, i) => i);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Pass to horizontal scroll handler
        onLeftRightScroll?.(event);

        // Also capture vertical scroll offset
        const yOffset = event.nativeEvent.contentOffset.y;
        setScrollOffset(yOffset);
    };

    const tapTimeBlockGesture = useMemo(() => 
        Gesture.Tap()
        .enabled(!isMonthVisible)
        .onEnd((e) => {
            const tappedY = e.absoluteY - dayColumnY + scrollOffset;
            const block = getTimeBlockFromY(tappedY, HOUR_HEIGHT)
            console.log("Tapped Y:", tappedY, "Block:", block);
            runOnJS(setSelectedTimeBlock)(block);
            runOnJS(setIsModalVisible)(true);
        }),[dayColumnY, scrollOffset, isMonthVisible]
    );

    const blockTop = selectedTimeBlock?.startMinutes ?? 0;
    const blockHeight = selectedTimeBlock?.endMinutes && selectedTimeBlock?.startMinutes ? selectedTimeBlock?.endMinutes - selectedTimeBlock?.startMinutes: 0;


    const topResizeGesture = useMemo(() => 
        Gesture.Pan()
        .onUpdate(e => {
            if(selectedTimeBlock?.startMinutes === undefined || !selectedTimeBlock?.startMinutes === undefined) return;
            
            const newStart = Math.round(selectedTimeBlock.startMinutes + (e.translationY * 60) / HOUR_HEIGHT);
            if (newStart < selectedTimeBlock.endMinutes - 15) {
                runOnJS(setSelectedTimeBlock)({
                    startMinutes: newStart,
                    endMinutes: selectedTimeBlock.endMinutes
                });
            }
        }),[HOUR_HEIGHT, selectedTimeBlock]
    );

    const bottomResizeGesture = useMemo(() => 
        Gesture.Pan()
        .onUpdate(e => {
            if(selectedTimeBlock?.startMinutes === undefined || !selectedTimeBlock?.startMinutes === undefined) return;

            const newEnd = Math.round((selectedTimeBlock.endMinutes + (e.translationY * 60) / HOUR_HEIGHT));
            if (newEnd !== undefined && newEnd > selectedTimeBlock.startMinutes + 15) {
                runOnJS(setSelectedTimeBlock)({
                    startMinutes: selectedTimeBlock.startMinutes,
                    endMinutes: newEnd
                });
            }
        }),[HOUR_HEIGHT, selectedTimeBlock]
    );

    const moveGesture = useMemo(() => 
        Gesture.Pan()
        .onUpdate(e => {
            const offset = Math.round(e.translationY / 15) * 15;
            if(selectedTimeBlock?.startMinutes === undefined || !selectedTimeBlock?.startMinutes === undefined) return;

            const newStart = selectedTimeBlock?.startMinutes + offset;
            const newEnd = selectedTimeBlock?.endMinutes + offset;
            runOnJS(setSelectedTimeBlock)({
                startMinutes: newStart,
                endMinutes: newEnd}
            );
        }),[selectedTimeBlock]
    );
    

    return (
            <View 
                style={{ flex: 1 }} 
                collapsable={true} 
                pointerEvents="auto"
                onLayout={(e) => {
                    e.target.measure((x, y, width, height, pageX, pageY) => {
                        setDayColumnY(pageY)
                    })
                }}
                >
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
                        const isSelected = isCurrentDay && selectedHour === hour;
                        return (
                        <GestureDetector gesture={tapTimeBlockGesture}> 
                            <TouchableOpacity
                            //Not sure this is all required anymore - to check
                                style={{
                                    height: HOUR_HEIGHT,
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                    backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                                    borderLeftWidth: isSelected ? 3 : 0,
                                    borderLeftColor: isSelected ? '#2196f3' : 'transparent',
                                    flexDirection: "row"
                                }}
                                disabled={!isCurrentDay}
                                onPress={() => onHourPress?.(hour)}
                            >
                                <View style={ styles.timeContainer}>
                                    <Text style={styles.time}>{`${hour}:00`}</Text>
                                </View>
                                <View style={ styles.hourBlockDivider} />

                                <View style={ styles.hourBlock}>
                                    {/* <Text>{date}</Text> */}
                                </View>
                            </TouchableOpacity>
                            </GestureDetector>
                        );
                    }}
                />

                {selectedTimeBlock?.startMinutes !== null && selectedTimeBlock?.endMinutes !== null && (
                    <View
                        pointerEvents="box-only"
                        style={[styles.selectedTimeBlock, {top: blockTop, height: blockHeight}]}
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
                    </View>
                )}
            </View>
    );
};


const styles = StyleSheet.create({
    timeContainer: {
        // justifyContent: 'flex-start', 
        // borderWidth: 1
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
        paddingLeft: 7, 
        alignItems: 'stretch' 
    },
    hourBlockDivider: {
        marginLeft: 5,
        width: 7, 
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
        left: 68,
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
