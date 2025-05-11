import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/context/authContext';

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}