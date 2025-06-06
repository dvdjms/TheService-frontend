import { AuthProvider } from '@/src/context/authContext';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
