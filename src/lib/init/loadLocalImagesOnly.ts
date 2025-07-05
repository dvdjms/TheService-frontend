import { useUserDataStore } from "@/src/store/zustand/useUserDataStore";
import * as FileSystem from 'expo-file-system';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos/';

export const loadLocalImagesOnly = async () => {
    const { setLocalImages } = useUserDataStore();

    const folderInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
    
    if (!folderInfo.exists || !folderInfo.isDirectory) {
        console.log('Photos directory does not exist');
        setLocalImages([]);
        return;
    }

    const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);

    const localImages = await Promise.all(
        files
        .filter(file => !file.startsWith('.') && file.toLowerCase().includes('photo'))
        .map(async (filename) => {
            const uri = PHOTOS_DIR + filename;
            const fileInfo = await FileSystem.getInfoAsync(uri);

            // Ensure file exists and is not a directory
            if (!fileInfo.exists || fileInfo.isDirectory) {
                return null;
            }

            return {
                uri,
                createdAt: fileInfo.modificationTime ?? Date.now(), // ← Safe access
                uploaded: false,
            };
        })
    );
    const nonNullImages = localImages.filter(
        (img): img is { uri: string; createdAt: number; uploaded: boolean } => img !== null
    );

    setLocalImages(nonNullImages);
};