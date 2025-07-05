import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import { ActivityIndicator, View } from 'react-native';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useUserDataStore } from '@/src/store/zustand/useUserDataStore'
import * as FileSystem from 'expo-file-system';
import { initializeUserData } from '@/src/lib/init/initializeUserData';


const PHOTOS_DIR = FileSystem.documentDirectory + 'photos/';

export default function Index() {
    const { isAuthenticated, hasCheckedAuth, userId, accessToken, subscriptionTier } = useAuth();
    configureReanimatedLogger({strict: false,});



    // const loadLocalImagesOnly = async () => {
    //     const folderInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
        
    //     if (!folderInfo.exists || !folderInfo.isDirectory) {
    //         console.log('Photos directory does not exist');
    //         setLocalImages([]);
    //         return;
    //     }

    //     const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);

    //     const localImages = await Promise.all(
    //         files
    //         .filter(file => !file.startsWith('.') && file.toLowerCase().includes('photo'))
    //         .map(async (filename) => {
    //             const uri = PHOTOS_DIR + filename;
    //             const fileInfo = await FileSystem.getInfoAsync(uri);

    //             // Ensure file exists and is not a directory
    //             if (!fileInfo.exists || fileInfo.isDirectory) {
    //                 return null;
    //             }

    //             return {
    //                 uri,
    //                 createdAt: fileInfo.modificationTime ?? Date.now(), // ← Safe access
    //                 uploaded: false,
    //             };
    //         })
    //     );
    //     const nonNullImages = localImages.filter(
    //         (img): img is { uri: string; createdAt: number; uploaded: boolean } => img !== null
    //     );

    //     setLocalImages(nonNullImages);
    // };


    useEffect(() => {
        if (isAuthenticated && userId && accessToken && subscriptionTier) {
            initializeUserData(userId, accessToken, subscriptionTier);
            // loadLocalImagesOnly();
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
