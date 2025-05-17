import React from 'react';
import { View, Text } from 'react-native';
import { addMinutes } from 'date-fns';

interface Props {
  startTime: Date;
  durationMinutes: number;
}

export default function BookingSummary({ startTime, durationMinutes }: Props) {
  const endTime = addMinutes(startTime, durationMinutes);

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Booking Summary</Text>
            <Text>Start: {startTime.toLocaleString()}</Text>
            <Text>End: {endTime.toLocaleString()}</Text>
        </View>
    );
}
