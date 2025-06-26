import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import { ActivityIndicator, View } from 'react-native';
import {configureReanimatedLogger} from 'react-native-reanimated';
import { useEffect } from 'react';
import { getAllClients } from '@/src/api/clients';
import { getAllAppointments } from '@/src/api/appointments';
import { useClientStore } from '@/src/store/clientStore';
import { useApptStore } from '@/src/store/apptStore';

export default function Index() {
    const { isAuthenticated, hasCheckedAuth, userId, accessToken } = useAuth();
    configureReanimatedLogger({strict: false,});
    const { setClients } = useClientStore();
    const { setAppts } = useApptStore();

    
    useEffect(() => {
        const initialize = async () => {
            if (isAuthenticated && accessToken) {
                try {
                    const [clientsRes, apptsRes] = await Promise.all([
                        getAllClients(userId, accessToken),
                        getAllAppointments(userId, accessToken),
                    ]);

                    const fetchedClients = clientsRes?.clients ?? [];
                    const fetchedAppointments = apptsRes?.appointments ?? [];

                    setClients(fetchedClients);
                    setAppts(fetchedAppointments);

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
