import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import { ActivityIndicator, View } from 'react-native';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useUserDataStore } from '@/src/store/zustand/useUserDataStore'
import * as FileSystem from 'expo-file-system';
import { initializeUserData } from '@/src/lib/init/initializeUserData';
import { loadLocalImagesOnly } from '@/src/lib/init/loadLocalImagesOnly';


export default function Index() {
    const { isAuthenticated, hasCheckedAuth, userId, accessToken, subscriptionTier } = useAuth();
    configureReanimatedLogger({strict: false,});

    useEffect(() => {
        if (isAuthenticated && userId && accessToken && subscriptionTier) {
            initializeUserData(userId, accessToken, subscriptionTier);
            //loadLocalImagesOnly();
        }
    }, [isAuthenticated, accessToken, userId, subscriptionTier]);


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
