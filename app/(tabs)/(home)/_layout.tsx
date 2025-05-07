import { Stack } from "expo-router";


export default function HomeLayout() {

  return (
    <Stack
        screenOptions={{
            headerStyle: {
            backgroundColor: '#777777',
            },
            headerTintColor: '#222222',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false, headerTitle: "",}} />
    </Stack>
    );
}