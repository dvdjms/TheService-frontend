import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CalendarMonthView from "@/src/components/schedular/CalendarMonthView";
import CalendarDayView from "@/src/components/schedular/CalendarDayView";
import { addDays, subDays } from "date-fns";
import { Ionicons } from '@expo/vector-icons';
import AppointmentBlock from "@/src/components/schedular/AppointmentBlock";
import Animated, { runOnJS, useSharedValue, withTiming, Easing, useAnimatedStyle, useAnimatedReaction } from "react-native-reanimated";
import { TimeBlock, Appointment, CalendarDayViewHandle } from '@/src/components/types/Service';
import dummyAppointments from "@/assets/mock-clients.json";


export default function SchedularScreen( ) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isMonthVisible, setIsMonthVisible] = useState(false);
    const calendarDayViewRef = useRef<CalendarDayViewHandle>(null);
    const monthHeight = useSharedValue<number>(0);
    const isModalVisible = useSharedValue(false);
    const MODAL_HEIGHT = 200;
    const appointments = useSharedValue<Appointment[]>([]);

    const selectedTimeBlock = useSharedValue<TimeBlock>({
        startMinutes: null,
        endMinutes: null,
        date: new Date(),
    })

    const visibleDates = ['2025-05-25', '2025-05-26', '2025-05-27'];

    useEffect(() => {
        const flattened = dummyAppointments.flatMap((user) =>
            user.appointments.map((appt) => ({
                ...appt,
                id: appt.id,
                appointment_title: appt.appointment_title,
                date: appt.date,
                startMinutes: appt.start_minutes,
                endMinutes: appt.end_minutes
            }))
        );
        appointments.value = flattened;
    }, []);



    const goToDate = useCallback((date: Date) => {
            setCurrentDate(date);
    }, []);


    const goToPreviousDay = useCallback(() => {
        const prevDay = subDays(currentDate, 1);
        goToDate(prevDay);
    }, [currentDate, goToDate]);


    const goToNextDay = useCallback(() => {
        const nextDay = addDays(currentDate, 1);
        goToDate(nextDay);
    }, [currentDate, goToDate]);


    const toggleMonth = () => {
        const monthMaxHeight = 270;
        const toValue = isMonthVisible ? 0 : monthMaxHeight;
        monthHeight.value = withTiming(toValue, { duration: 300, easing: Easing.inOut(Easing.ease) }, () => {
            runOnJS(setIsMonthVisible)(!isMonthVisible);
        });
    };

    const collapseMonth = () =>  {
        if (isMonthVisible) {
            monthHeight.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }, () => {
                runOnJS(setIsMonthVisible)(false);
            });
        }
    }

    const handleSelectedDate = (date: Date) => {
        if (calendarDayViewRef.current) {
            calendarDayViewRef.current?.swipeToDateImpl(date);
        }
        setCurrentDate(date);
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


    const animatedStyleModal = useAnimatedStyle(() => {
        const isVisible = isModalVisible.value;
        return {
            opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
            height: withTiming(isVisible ? MODAL_HEIGHT : 0, { duration: 300 }),
            overflow: 'hidden',
        };
    });


    return (
        <>
    
        <View style={styles.container}>
            {/* Toggle Button */}
            <TouchableOpacity onPress={toggleMonth}>
                <Text style={styles.dateHeader}>
                    {/* {format(currentDate, 'MMM yyyy')} {' '} */}
                    <Ionicons name={isMonthVisible ? 'chevron-up' : 'chevron-down' } size={18} color="gray" />
                </Text>
            </TouchableOpacity>

            {/* Sliding Month View */}
            <Animated.View
                style={[{ overflow: 'hidden' }, useAnimatedStyle(() => ({ height: withTiming(monthHeight.value, { duration: 300 },)}))]}>
                <CalendarMonthView
                    currentDate={currentDate}
                    onSelectDate={handleSelectedDate}
                />
            </Animated.View>

            {/* Calendar Day View */}
            <Animated.View style={{ flex: 1 }}>
                <CalendarDayView
                    // currentDate={format(currentDate, 'yyy-MM-dd')}
                    ref={calendarDayViewRef}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    isMonthVisible={isMonthVisible}
                    goToPreviousDay={goToPreviousDay}
                    goToNextDay={goToNextDay}
                    collapseMonth={collapseMonth}
                    selectedTimeBlock={selectedTimeBlock}
                    isModalVisible={isModalVisible}
                    appointments={appointments}
              />
            </Animated.View>
        </View>

          {/* Sliding Appointment View */}
        <Animated.View
            style={[{ overflow: 'hidden'}, animatedStyleModal]}
            >
            <AppointmentBlock
                selectedTimeBlock={selectedTimeBlock}
                currentDate={currentDate}
                onClose={() => {
                    isModalVisible.value = false;
                }}
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
});