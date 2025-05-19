import { View, StyleSheet, Animated, TouchableOpacity, Text, PanResponder } from "react-native";
import React, { useRef, useState } from 'react';
import CalendarMonthView from "@/src/components/schedular/CalendarMonthView";
import CalendarDayView from "@/src/components/schedular/CalendarDayView";
import { addDays, format, subDays } from "date-fns";
import { Ionicons } from '@expo/vector-icons';

export default function SchedularScreen() {
    const [selectedDate, setSelectedDate] = useState<string>(getToday());
    const [isMonthVisible, setIsMonthVisible] = useState(false);
    const monthHeight = useRef(new Animated.Value(0)).current;
    const monthMaxHeight = 270;

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    const goToPreviousDay = (): void => {
        const prevDay = subDays(new Date(selectedDate), 1);
        setSelectedDate(prevDay.toISOString().split('T')[0]);
    }

    const goToNextDay = (): void => {
        const nextDay = addDays(new Date(selectedDate), 1);
        setSelectedDate(nextDay.toISOString().split('T')[0]);
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
                return gestureState.dy < -10; // detect swipe up
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -50 && isMonthVisible) {
                    toggleMonth();
                }
            },
        })
    ).current;

    const handleMonthChange = (newDate: Date) => {
        // setShorterMonth(startOfMonth(newDate));
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };
    
    return (
        <View style={{ flex: 1 }} >
            {/* Toggle Button */}
            <TouchableOpacity onPress={toggleMonth}>
                <Text style={styles.dateHeader}>
                    {format(selectedDate, 'MMM yyyy')} {' '}
                    <Ionicons name={isMonthVisible ? 'chevron-up' : 'chevron-down' } size={18} color="gray" />
                </Text>
            </TouchableOpacity>

            {/* Sliding Month View */}
            <Animated.View
                style={{ height: monthHeight, overflow: 'hidden' }}
                {...panResponder.panHandlers}
                // pointerEvents={isMonthVisible ? 'auto' : 'none'}
            >
                <CalendarMonthView
                    onMonthChange={handleMonthChange}
                    // shorterMonth={selectedDate}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                        // setVisibleMonth(date)
                    }}
                />
            </Animated.View>

            <View style={ !isMonthVisible && styles.dayContainer ? styles.dayContainer : styles.dayContainer2}>
                <Text style={ styles.dayName }>{format(selectedDate, 'EEE' ).toUpperCase()}</Text>
                <Text style={ styles.dayNumber }>{format(selectedDate, 'dd')}</Text>
            </View>

            {/* Day View below */}
            <CalendarDayView
                date={format(selectedDate, 'yyy-MM-dd')}
                
                onSwipeLeft={goToNextDay}
                onSwipeRight={goToPreviousDay}
                onSwipeUp={collapseMonth}
                onTap={collapseMonth}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',//colors.background,
        padding: 2,
        overflow: 'hidden'
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