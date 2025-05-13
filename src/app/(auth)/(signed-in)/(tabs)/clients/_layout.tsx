import { Stack } from 'expo-router';

export default function ClientsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: 'modal',
            }}>            
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* <Stack.Screen name="[id]" options={{ headerShown: false }} /> */}
        </Stack>

    );
}