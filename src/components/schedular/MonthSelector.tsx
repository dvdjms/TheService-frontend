import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

type ViewMode = 'month' | 'day';

export default function CalendarSelector() {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [selectedDate, setSelectedDate] = useState<string>(getToday());
    const [value, setValue] = useState(1);

    const buttons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    // useEffect(() => {
    //     onChange(value * 3);
    // }, [value, unit, onChange]);
    function getToday() {
        return new Date().toISOString().split('T')[0];
    }


    return (
        <View style={{ flex: 1, padding: 16 }}>

            <SegmentedButtons
                value={ViewMode}
                onValueChange={(v: string) => {
                //   setUnit(v as Unit);
                    setValue(1); // reset to 1 for new unit
                }}
                buttons={[
                    { value: 'Jan', label: 'Jan' },
                    { value: 'Feb', label: 'Feb' },
                    { value: 'Mar', label: 'Mar' },
                    { value: 'Apr', label: 'Apr' },
                    { value: 'May', label: 'May' },
                    { value: 'Jun', label: 'Jun' },
                    { value: 'Jul', label: 'Jul' },
                    { value: 'Aug', label: 'Aug' },
                    { value: 'Sep', label: 'Sep' },
                    { value: 'Oct', label: 'Oct' },
                    { value: 'Nov', label: 'Nov' },
                    { value: 'Dec', label: 'Dec' },
                ]}
                      style={{ marginBottom: 16 }}
                  />




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
