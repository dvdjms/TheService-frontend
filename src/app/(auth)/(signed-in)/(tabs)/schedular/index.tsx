import { View, StyleSheet } from "react-native";
import { colors } from '@/src/styles/globalStyles';
import React, { useState } from 'react';
import DurationPicker from "@/src/components/schedular/DurationPicker";
import CalendarSelector from "@/src/components/schedular/CalendarSelector";
import CalendarMonthView from "@/src/components/schedular/CalendarMonthView";

export default function SchedularScreen() {
    const [durationMinutes, setDurationMinutes] = useState(60);


    // Use Google Calendar for inspiration

    return (
        <View style={styles.container}>
            <CalendarMonthView />
                
                <View style={styles.spacer} />
            
            <DurationPicker onChange={setDurationMinutes} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 2,
    },
    spacer: {
        marginTop: 0,
        borderTopWidth: 1,
        borderColor: '#cccccc',
        marginHorizontal: 10,
        paddingTop: 5,
    },
});