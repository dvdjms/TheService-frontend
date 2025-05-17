import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, CalendarProps } from 'react-native-calendars';
import { format } from 'date-fns';
import { addDays, subDays } from 'date-fns';
import DayCalendarView from './CalendarDayView';
import { colors } from '@/src/styles/globalStyles';

type ViewMode = 'month' | 'day';

export default function CalendarSelector() {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [selectedDate, setSelectedDate] = useState<string>(getToday());

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    // Handler for day press in calendar
    const onDayPress: CalendarProps['onDayPress'] = (day) => {
        setSelectedDate(day.dateString);
        setViewMode('day');
    };

    function goToPreviousDay(): void {
        const prevDay = subDays(new Date(selectedDate), 1);
        setSelectedDate(prevDay.toISOString().split('T')[0]);    
    }

    function goToNextDay(): void {
        const nextDay = addDays(new Date(selectedDate), 1);
        setSelectedDate(nextDay.toISOString().split('T')[0]);    
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            {/* Toggle buttons */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <TouchableOpacity
                    onPress={() => setViewMode('month')}
                    style={{
                        flex: 1,
                        padding: 12,
                        backgroundColor: viewMode === 'month' ? '#4ade80' : '#d1d5db',
                        alignItems: 'center',
                        borderRadius: 4,
                        marginRight: 8,
                    }}
                >
                    <Text style={{ fontWeight: 'bold' }}>Month View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setViewMode('day')}
                    style={{
                        flex: 1,
                        padding: 12,
                        backgroundColor: viewMode === 'day' ? '#4ade80' : '#d1d5db',
                        alignItems: 'center',
                        borderRadius: 4,
                    }}
                >
                    <Text style={{ fontWeight: 'bold' }}>Day View</Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'month' ? (
                <Calendar
                    theme={{
                        calendarBackground: 'transparent',
                        backgroundColor: '#ffffff',
        
                        textSectionTitleColor: 'yellow', // days Sun Mon
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
             
                        dayTextColor: 'orange', // days numbered
                        textDisabledColor: '#d9e1e8',// days disable

                        arrowColor: 'red',
                        disabledArrowColor: '#d9e1e8',

                        monthTextColor: 'white', // May 2025

                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16, // day numbers
                        textMonthFontSize: 14, // may 2025
                        textDayHeaderFontSize: 12 // days Sun Mon
      
                
                    }}
                    
                    style={ styles.calendar }
                    onDayPress={onDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: '#4ade80' },
                    }}
                    />
                ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.dayHeader}>
                        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrow}>
                            <Text style={styles.arrowText}>←</Text>
                        </TouchableOpacity>

                        <Text style={styles.dateText}>
                            {format(selectedDate, 'EEEE dd MMM yyy')}
                        </Text>

                        <TouchableOpacity onPress={goToNextDay} style={styles.arrow}>
                            <Text style={styles.arrowText}>→</Text>
                        </TouchableOpacity>
                    </View>

                    <DayCalendarView
                        date={selectedDate}
                        onSwipeLeft={goToNextDay}
                        onSwipeRight={goToPreviousDay}
                    />
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        flex: 1,
    },
    arrow: {
        padding: 12,
    },
    arrowText: {
        fontSize: 20,
    },
    calendar: {
        backgroundColor: 'gray', //colors.backgroundHeaderFooter,
        borderRadius: 3,
    }
});
