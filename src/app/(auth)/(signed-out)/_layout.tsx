import { View, ActivityIndicator} from 'react-native';
import { Redirect } from 'expo-router';
import Stack from 'expo-router/drawer';
import { useAuth } from '@/src/context/authContext';

export default function SignedOutLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) return <Redirect href="/home" />;
    // chnage verify email to popup with seperate inputs for each digit.
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="signin"
                options={{
                    title: 'Sign In',
                }}
            />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="verify-email" /> 
        </Stack>

    )
}