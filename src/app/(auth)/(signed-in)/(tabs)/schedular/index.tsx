import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useCallback, useRef, useState } from 'react';
import CalendarMonthView from "@/src/components/schedular/CalendarMonthView";
import CalendarDayView, { CalendarDayViewHandle } from "@/src/components/schedular/CalendarDayView";
import { addDays, format, subDays } from "date-fns";
import { Ionicons } from '@expo/vector-icons';
import AppointmentBlock from "@/src/components/schedular/AppointmentBlock";
import Animated, { runOnJS, useSharedValue, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";
import { TimeBlock } from '@/src/components/utils/timeBlockUtils';
import { getToday } from "@/src/components/utils/timeUtils";



export default function SchedularScreen() {
    const [currentDate, setCurrentDate] = useState<string>(getToday())
    const [isMonthVisible, setIsMonthVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
 
    const monthHeight = useSharedValue(0);

    const selectedTimeBlock = useSharedValue<TimeBlock>({
        startMinutes: null,
        endMinutes: null,
        date: currentDate
    });

    const calendarDayViewRef = useRef<CalendarDayViewHandle>(null);

    const goToDate = useCallback((dateString: string) => {
            setCurrentDate(dateString);
    }, []);

    const goToPreviousDay = useCallback(() => {
    const prevDay = subDays(new Date(currentDate), 1);
        goToDate(prevDay.toISOString().split('T')[0]);
    }, [currentDate, goToDate]);

    const goToNextDay = useCallback(() => {
        const nextDay = addDays(new Date(currentDate), 1);
        goToDate(nextDay.toISOString().split('T')[0]);
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

    const handleSelectedDate = (date: string) => {
        console.log('calendarDayViewRef.current:', calendarDayViewRef.current);
        if (calendarDayViewRef.current) {
            calendarDayViewRef.current?.swipeToDateImpl(date);
        }
        setCurrentDate(date);
    };

    
    return (
        <>
        <View style={styles.container}>
            {/* Toggle Button */}
            <TouchableOpacity onPress={toggleMonth}>
                <Text style={styles.dateHeader}>
                    {format(new Date(currentDate), 'MMM yyyy')} {' '}
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
            {/* Day View below */}
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
                    setIsModalVisible={setIsModalVisible}
              />
            </Animated.View>
        </View>


        <AppointmentBlock
            visible={isModalVisible}
            selectedTimeBlock={selectedTimeBlock}
            currentDate={currentDate}
            onClose={() => {
                setIsModalVisible(false);
            }}
            onSave={(title) => {
                // Handle saving the appointment
                console.log(`Saved appointment for ${selectedTimeBlock.value?.startMinutes}:00 - ${title}`);
            }}
        />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dayContainer: {
        backgroundColor: "white",
        borderRadius: 2,
        // iOS shadow
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderBottomColor: 'grey',
        zIndex: 1,
        // Android shadow (elevation = spread + blur approximation)
        elevation: 4
    },
    dayContainer2:{
        backgroundColor: 'white',  
        borderBottomColor: '#eee', 
        borderBottomWidth: 1
    },
    dayName: {
        backgroundColor: "transparent",
        paddingTop: 7,
        paddingBottom: 3,
        width: 60,
        textAlign: 'center',
        fontSize: 12,
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        fontWeight: 500
    },
    dayNumber: {
        backgroundColor: "white",
        width: 60,
        textAlign: 'center',
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        paddingBottom: 3,
        fontWeight: 500
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