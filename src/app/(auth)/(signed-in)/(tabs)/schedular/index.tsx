import { View, StyleSheet, Animated, TouchableOpacity, Text, PanResponder } from "react-native";
import React, { useRef, useState } from 'react';
import CalendarMonthView from "@/src/components/schedular/CalendarMonthView";
import CalendarDayView from "@/src/components/schedular/CalendarDayView";
import { addDays, format, subDays } from "date-fns";
import { Ionicons } from '@expo/vector-icons';


export default function SchedularScreen() {
    const [currentDate, setCurrentDate] = useState<string>(getToday())
    const [isMonthVisible, setIsMonthVisible] = useState(false);
    const monthHeight = useRef(new Animated.Value(0)).current;
    const monthMaxHeight = 270;

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    const goToPreviousDay = (): void => {
        console.log("goToPreviousDay")
        const prevDay = subDays(new Date(currentDate), 1);
        setCurrentDate(prevDay.toISOString().split('T')[0]);
    }

    const goToNextDay = (): void => {
        console.log("goToNextDay")
        const nextDay = addDays(new Date(currentDate), 1);
        setCurrentDate(nextDay.toISOString().split('T')[0]);
    }

    const toggleMonth = () => {
        const toValue = isMonthVisible ? 0 : monthMaxHeight;
        Animated.timing(monthHeight, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setIsMonthVisible(!isMonthVisible);
        });
    };

    const collapseMonth = () =>  {
        if (isMonthVisible) {
            console.log("collapseMonth")
            Animated.timing(monthHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsMonthVisible(false));
        }
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return isMonthVisible && gestureState.dy < -10; // detect swipe up
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isMonthVisible && gestureState.dy < -50 ) {
                    toggleMonth();
                }
            },
        })
    ).current;

    const handleMonthChange = (newDate: Date) => {
        setCurrentDate(newDate.toISOString().split('T')[0]);
    };
    
    return (
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
                style={{ height: monthHeight, overflow: 'hidden' }}>
                <CalendarMonthView
                    onMonthChange={handleMonthChange}
                    onSelectDate={(date) => setCurrentDate(date)}
                />
            </Animated.View>

            <View style={ isMonthVisible ? styles.dayContainer2 : styles.dayContainer}>
                <Text style={ styles.dayName }>{format(new Date(currentDate), 'EEE' ).toUpperCase()}</Text>
                <Text style={ styles.dayNumber }>{format(new Date(currentDate), 'dd')}</Text>
            </View>

            {/* Day View below */}
            <View style={{ flex: 1 }}>
                <CalendarDayView
                    currentDate={format(currentDate, 'yyy-MM-dd')}
                    isMonthVisible={isMonthVisible}
                    onSwipeLeft={goToNextDay}
                    onSwipeRight={goToPreviousDay}
                    onSwipeUp={collapseMonth}
                    onTap={collapseMonth}
                />
            </View>
        </View>
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
        elevation: 4,
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
        width: 70,
        textAlign: 'center',
        fontSize: 12,
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        fontWeight: 500
    },
    dayNumber: {
        backgroundColor: "white",
        width: 70,
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