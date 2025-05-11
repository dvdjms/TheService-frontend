import { useAuth } from '@/src/context/authContext';
import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';


export default function AuthLayout() {

    const { isLoading, hasCheckedAuth } = useAuth();

    if (isLoading || !hasCheckedAuth) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }}/>;

}

