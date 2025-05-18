import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar, CalendarProps  } from 'react-native-calendars';

type CalendarMonthViewProps = {
    onSelectDate: (date: string) => void;
    onSwipeUp?: () => void;
};

export default function CalendarMonthView({ onSelectDate }: CalendarMonthViewProps) {
    const [selectedDate, setSelectedDate] = useState<string>(getToday());

    //const today = new Date().toISOString().split('T')[0];

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    // Handler for day press in calendar
    const onDayPress: CalendarProps['onDayPress'] = (day) => {
        onSelectDate(day.dateString)
        setSelectedDate(day.dateString);
    };
// https://www.npmjs.com/package/react-native-calendars/v/1.1286.0
    return (
        <View style={{ 
            flex: 1, 
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
                theme={{    
                    // Custom style overrides (bypass TS)
                    ...{
                        'stylesheet.calendar.main': {
                            week: {
                                // height: 37,
                                marginTop: 4,
                                marginBottom: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                margin: 0
                            },
                        },
                        'stylesheet.day.basic': {
                            day: {
                                width: 37,
                                // height: 37,
                                // alignItems: 'center',
                                // justifyContent: 'center',
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

                    calendarBackground: 'white',
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
                    [selectedDate]: { selected: true, selectedColor: '#4ade80' },
                }}

                hideExtraDays={true}

                hideArrows={true}  
                renderHeader={date => {
                    return null //<Text>S M T W T F S</Text>
                }}

            />
        </View>
    );
}
