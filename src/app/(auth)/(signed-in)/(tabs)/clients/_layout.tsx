import { Stack } from 'expo-router';


export default function ClientsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: 'card',
                // animation: 'slide_from_right',
                // animation: "default",
                // gestureEnabled: true,
                // gestureDirection: 'horizontal',
            }}>            
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>

    );
}