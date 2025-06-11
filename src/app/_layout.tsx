import { AuthProvider } from '@/src/context/authContext';
import { Slot } from 'expo-router';


export default function RootLayout() {

    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
