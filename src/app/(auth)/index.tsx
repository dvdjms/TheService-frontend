import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import { ActivityIndicator, View } from 'react-native';
// import {configureReanimatedLogger} from 'react-native-reanimated';

export default function Index() {
    const { isAuthenticated, hasCheckedAuth } = useAuth();
    // configureReanimatedLogger({strict: false,});

    if (!hasCheckedAuth) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/home" />;
    } else {
        return <Redirect href="/signin" />;
    }
}
