// CalendarScreen.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { DayColumn } from '@/src/components/schedular/DayColumn'
import { useSharedValue } from 'react-native-reanimated';

const CalendarScreen = () => {
  const appointments = useSharedValue([]); // fetched from backend
  const selectedTimeBlock = useSharedValue(null);

  const visibleDates = ['2025-05-25', '2025-05-26', '2025-05-27'];

  useEffect(() => {
    // Flatten and format dummy appointment data for rendering
    const flattened = dummyAppointments.flatMap((user) =>
      user.appointments.map((appt) => ({
        ...appt,
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
      }))
    );
    appointments.value = flattened;
  }, []);

  return (

  );
};

export default CalendarScreen;