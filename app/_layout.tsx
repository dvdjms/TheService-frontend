import { AuthProvider, useAuth } from '../src/context/authContext';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    // Redirect to login or tabs
    return (
        <Slot />
    );
}

export default function Layout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
