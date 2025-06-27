import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import { ActivityIndicator, View } from 'react-native';
import {configureReanimatedLogger} from 'react-native-reanimated';
import { useEffect } from 'react';
import { getUserData } from '@/src/api/userData';
import { useUserDataStore } from '@/src/store/useUserDataStore'

export default function Index() {
    const { isAuthenticated, hasCheckedAuth, userId, accessToken } = useAuth();
    configureReanimatedLogger({strict: false,});

    const {
        setUser,
        setClients,
        setAppointments,
        setImages,
    } = useUserDataStore();

    useEffect(() => {
        const initialize = async () => {
            if (isAuthenticated && accessToken) {
                try {
                    const data = await getUserData(userId, accessToken);

                    const user = data?.user ?? null;
                    const clients = data?.clients ?? [];
                    const appointments = data?.appointments ?? [];
                    const images = data?.images ?? [];

                    setUser(user);
                    setClients(clients);
                    setAppointments(appointments);
                    setImages(images);

                } catch (error) {
                    console.error("Error initializing app data:", error);
                    // Optionally: showToast("Failed to load data"); or setError("...");
                }
            }
        };
        initialize();
    }, [isAuthenticated, userId, accessToken]);



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
