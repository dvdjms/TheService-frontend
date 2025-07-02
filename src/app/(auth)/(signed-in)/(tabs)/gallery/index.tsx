import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import PhotoGrid from '@/src/components/gallery/PhotoGrid';
import FormButton from '@/src/components/ui/FormButton';
import GalleryModal from '@/src/components/gallery/GalleryModal';
import { useAuth } from '@/src/context/authContext';
import { createImage } from '@/src/api/images';
import { Appointment, Client } from '@/src/components/types/Service';

const loadPhotos = async () => {
    const photosDir = FileSystem.documentDirectory + 'photos';
    const files = await FileSystem.readDirectoryAsync(photosDir);

    const photoFiles = files.filter(file => {
        return !file.startsWith('.') && file.toLowerCase().includes('photo')
    });
    return photoFiles.map((fileName) => `${photosDir}/${fileName}`);
};

// saving .DS_Store when I click 'select Client'

export default function GalleryScreen() {
    const { userId, accessToken } = useAuth();
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchPhotos = async () => {
        try {
            const uris = await loadPhotos();
            setPhotos(uris);
        } catch (error) {
            console.error('Failed to load photos', error);
        } finally {
            setLoading(false);
        }
        };
        fetchPhotos();
    }, []);

    const toggleSelect = (uri: string) => {
        setSelectedPhotos((prev) =>
            prev.includes(uri) ? prev.filter((u) => u !== uri) : [...prev, uri]
        );
    };


    const handleModal = () => {
        setModalVisible(prev => !prev);
    };


    const handleUpload = async (client: Client, appt: Appointment) => {
        try {

            const base64Images = await Promise.all(
                selectedPhotos.map(async (fileUri) => {
                    const base64 = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64,
                    });
                    return base64;
                })
            );

            const data = {
                userId: userId,
                clientId: client.clientId,
                apptId: appt.apptId,
                image: base64Images
            };

            if(accessToken){
                const response = await createImage(accessToken, data);
                console.log("response", response)

                if (response) {
                    // Loop over selectedPhotos to delete each local file
                    for (const uri of selectedPhotos) {
                        try {
                            await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
                            console.log('Photo deleted');
                        } catch (deleteError) {
                            console.warn("Failed to delete file:", uri, deleteError);
                        }
                    }
                    // Also update your state/store to clear selectedPhotos after deletion
                    setSelectedPhotos([])
                }
            }
        } catch (error){
            console.error("Error uploading images", error);
        }
    };

    if (loading) return <Text>Loading photos...</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setSelectMode((prev) => !prev)}>
                    <Text style={styles.topBarText}>{selectMode ? 'Cancel' : 'Select'}</Text>
                </TouchableOpacity>
            </View>

            {photos.length === 0 ? (
                <Text>No photos found</Text>
            ) : (
                <>
                    <PhotoGrid
                        photos={photos}
                        selectMode={selectMode}
                        selectedPhotos={selectedPhotos}
                        onSelect={toggleSelect}
                        onPreview={(uri) => setPreviewPhoto(uri)}
                    />

                    {selectedPhotos.length > 0 && (
                        <View style={styles.buttonWrapper}>
                            <FormButton
                                OnPress={handleModal}
                                title={'Tag images'}
                                width={0.9}
                            />
                        </View>
                    )}
                </>
            )}

            {previewPhoto && !selectMode && (
                <Modal visible={true} transparent={false} animationType="slide">
                    <View style={styles.previewContainer}>
                        <TouchableOpacity
                            onPress={() => setPreviewPhoto(null)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={32} color="white" />
                        </TouchableOpacity>

                        <Image
                            source={{ uri: previewPhoto }}
                            style={styles.previewImage}
                            resizeMode="contain"
                        />

                        {/* {selectMode && ( */}
                            <TouchableOpacity
                                onPress={() => toggleSelect(previewPhoto)}
                                style={styles.selectButton}
                            >
                                <Ionicons
                                    name={
                                        selectedPhotos.includes(previewPhoto)
                                        ? 'checkmark-circle'
                                        : 'ellipse-outline'
                                    }
                                    size={32}
                                    color="green"
                                />
                            </TouchableOpacity>
                        {/* )} */}
                    </View>
                </Modal>
            )}

            <GalleryModal visible={modalVisible} handleUpload={handleUpload} onClose={handleModal} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 10 
    },
    topBar: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        padding: 10 
    },
    topBarText: { 
        fontSize: 16, 
        color: '#007AFF' 
    },
    buttonWrapper: { 
        marginTop: 10, 
        alignItems: 'center' },
    previewContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 2,
    },
    selectButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        zIndex: 2,
    },
    previewImage: {
        width: '100%',
        height: '80%',
    },
});
