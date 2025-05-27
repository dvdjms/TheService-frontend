import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar, CalendarProps  } from 'react-native-calendars';
import { format, isValid, startOfMonth } from 'date-fns';
import MonthScroller from './MonthScroller';

type CalendarMonthViewProps = {
    currentDate: Date;
    onSelectDate: (date: Date) => void;
};

export default function CalendarMonthView({ onSelectDate, currentDate }: CalendarMonthViewProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date(currentDate)));


    useEffect(() => {
        setSelectedDate(currentDate);
        setCurrentMonth(startOfMonth(currentDate));
    }, [currentDate]);

  
    const currentDateStr = isValid(currentDate) ? format(currentDate, 'yyyy-MM-dd') : '';
    const selectedStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    const highlightedDate = selectedStr ?? currentDateStr;


    // Handler for day press in calendar
    const onDayPress: CalendarProps['onDayPress'] = (day) => {
        const selectedDate = new Date(day.dateString);
        onSelectDate(selectedDate)
        setSelectedDate(selectedDate);
    };

    const updateMonthPreservingDay = (newMonthDate: Date) => {
        const day = selectedDate?.getDate();
        const year = newMonthDate.getFullYear();
        const month = newMonthDate.getMonth();

        const tentativeDate = new Date(year, month, day);
        const fallbackDate = startOfMonth(newMonthDate);
        const validDate = tentativeDate.getMonth() === month ? tentativeDate : fallbackDate;

        setSelectedDate(validDate);
        onSelectDate(validDate);
        setCurrentMonth(startOfMonth(newMonthDate));
    };
    

// https://www.npmjs.com/package/react-native-calendars/v/1.1286.0
    return (
        <>
        <View   
            style={{ 
                flex: 1,
                // height is 267 cannot be changed
                maxHeight: 870,
                backgroundColor: 'white', 
                shadowColor: 'gray',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.001,
                shadowRadius: 3,
                borderBottomColor: 'grey',
                marginBottom: 3,
                // Android shadow
                elevation: 4,
            }}>
            <Calendar
                key={format(currentMonth, 'yyyy-MM')} // force rerender when month changes
                current={format(currentMonth, 'yyyy-MM-dd')}
                onMonthChange={(month) => updateMonthPreservingDay(new Date(month.dateString))}
                theme={{    
                    // Custom style overrides (bypass TS)
                    ...{
                        'stylesheet.calendar.main': {
                            container: {
                                // minHeight: 360,
                                // height: 360,
                                // backgroundColor: 'transparant'
                            },
                            week: {
                                marginTop: 4,
                                marginBottom: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                margin: 0,
                            },
                        },
                        'stylesheet.day.basic': {
                            day: {
                                width: 37,
                            },
                        },
                        'stylesheet.calendar.header': {
                            header: {
                                height: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 0,  // controls horizontal space between day names
                                marginVertical: 0,    // controls top/bottom spacing
                                color: 'gray',
                            }
                        },
                    } as any,

                    calendarBackground: 'transparent',
                    backgroundColor: 'blue', // no seen changes
                    textSectionTitleColor: 'black', // days Sun Mon
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    dayTextColor: 'brown', // days numbered
                    textDisabledColor: '#d9e1e8',// days disable
                    arrowColor: 'gray',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: 'gray', // May 2025
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 14, // day numbers
                    textMonthFontSize: 14, // may 2025
                    textDayHeaderFontSize: 12, // days Sun Mon
                }}
                enableSwipeMonths={true}
                onDayPress={onDayPress}
                markedDates={{
                    [highlightedDate]: { selected: true, selectedColor: '#4ade80' },
                }}
                hideExtraDays={true}
                hideArrows={true}  
                renderHeader={date => {
                    return null;
                }}
            />
             {/* Unsure where to place this - maybe in the parent  */}
            <MonthScroller
                currentMonth={currentMonth}
                onMonthPress={(month) => updateMonthPreservingDay(new Date(month))}
            /> 
        </View>
        </>
    );
}
