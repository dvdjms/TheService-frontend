import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useRef, useState } from 'react';
import CalendarMonthView from "@/src/components/schedular/CalendarMonthView";
import CalendarDayView from "@/src/components/schedular/CalendarDayView";
import { Ionicons } from '@expo/vector-icons';
import AppointmentBlock from "@/src/components/schedular/AppointmentBlock";
import Animated, { runOnJS, useSharedValue, withTiming, Easing, useAnimatedStyle, useAnimatedReaction, useDerivedValue } from "react-native-reanimated";
import { TimeBlock, CalendarDayViewHandle } from '@/src/components/types/Service';
import { format } from "date-fns";


export default function SchedularScreen() {
    // const [selectedDate, setSelectedDate] = useState(Date.now());
    const [selectedDate, setSelectedDate] = useState(() => {
        const initialDate = Date.now();
        return initialDate;
    });

    const [isMonthVisible, setIsMonthVisible] = useState(false);
    const calendarDayViewRef = useRef<CalendarDayViewHandle>(null);
    const monthHeight = useSharedValue<number>(0);
    const isModalVisible = useSharedValue(false);
    const isModalExpanded = useSharedValue(false);
    const selectedDateShared = useSharedValue(selectedDate);
    const previewDate = useSharedValue<number | null>(null);

    const selectedTimeBlock = useSharedValue<TimeBlock>({
        startMinutes: null,
        endMinutes: null,
        date: selectedDate,
    });


    const toggleMonth = () => {
        const monthMaxHeight = 270;
        const toValue = isMonthVisible ? 0 : monthMaxHeight;
        monthHeight.value = withTiming(toValue, { duration: 200, easing: Easing.inOut(Easing.ease) }, () => {
            runOnJS(setIsMonthVisible)(!isMonthVisible);
        });
    };


    const handleSelectedDate = (date: Date) => {
        if (calendarDayViewRef.current) {
            calendarDayViewRef.current?.swipeToDateImpl(date);
        }
        setSelectedDate(date.getTime());
    };


    const collapseMonth = () =>  {
        if (isMonthVisible) {
            monthHeight.value = withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) }, () => {
                runOnJS(setIsMonthVisible)(false);
            });
        }
    };

    
    useAnimatedReaction(
        () => selectedTimeBlock.value,
        (block) => {
            const isValid =
            block?.startMinutes !== null &&
            block?.endMinutes !== null;
            isModalVisible.value = isValid;
        }
    );


    const modalHeight = useDerivedValue(() => {
        if (!isModalVisible.value) return withTiming(0, {duration: 200})
        return withTiming(isModalExpanded.value ? 170 : 50, { duration: 200 });
    });


    const animatedMonthStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(monthHeight.value, { duration: 200 })
        };
    });


    const animatedCalendarStyle = useAnimatedStyle(() => {
        return {
            // flex: 1,
        };
    });


    const animatedModalStyle = useAnimatedStyle(() => {
        const isVisible = isModalVisible.value;
        return {
            opacity: withTiming(isVisible ? 1 : 0, { duration: 200}),
            height: modalHeight.value,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0
        };
    });


    const dynamicModalPadding = useDerivedValue(() => {
        return isModalVisible.value ? modalHeight.value : 0;
    });


    return (
        <>
        <View style={styles.container}>
            {/* Toggle Button */}
            <TouchableOpacity onPress={toggleMonth}>
                <Text style={styles.dateHeader}>
                    {format(selectedDate, 'MMM yyyy')} {' '}
                    <Ionicons name={isMonthVisible ? 'chevron-up' : 'chevron-down' } size={18} color="gray" />
                </Text>
            </TouchableOpacity>

            {/* Sliding Month View */}
            <Animated.View
                style={[{ overflow: 'hidden' }, animatedMonthStyle ]}>
                <CalendarMonthView
                    selectedDate={selectedDate}
                    handleSelectedDate={handleSelectedDate}
                />
            </Animated.View>

            {/* Calendar Day View */}
            <Animated.View style={[{flex: 1}, animatedCalendarStyle]}>
                <CalendarDayView
                    ref={calendarDayViewRef}
                    selectedDate={selectedDate}
                    selectedDateShared={selectedDateShared}
                    setSelectedDate={setSelectedDate}
                    isMonthVisible={isMonthVisible}
                    collapseMonth={collapseMonth}
                    selectedTimeBlock={selectedTimeBlock}
                    isModalVisible={isModalVisible}
                    previewDate={previewDate}
                    isModalExpanded={isModalExpanded}
                    dynamicModalPadding={dynamicModalPadding}
              />
            </Animated.View>
        </View>

          {/* Sliding Appointment View */}
        <Animated.View
            style={[styles.appointmentBlock, animatedModalStyle]}
            >
            <AppointmentBlock
                isModalExpanded={isModalExpanded}
                selectedTimeBlock={selectedTimeBlock}
                selectedDate={selectedDate}
                isModalVisible={isModalVisible}
                onSave={(title) => {
                    // Handle saving the appointment
                    // console.log(`Saved appointment for ${selectedTimeBlock.value?.startMinutes}:00 - ${title}`);
                }}
            >
            </AppointmentBlock>
        </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'absolute', //???? Unsure why, also works with realative 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0
    },
    dateHeader: {
        height: 30,
        fontSize: 16,
        textAlign: 'center',
        padding: 4,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    appointmentBlock: {
        overflow: 'hidden',
        backgroundColor: 'rgba(221, 221, 221, 0.95)',
        // backgroundColor: '#ddd',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 10,
        pointerEvents: 'box-none'
    }
});