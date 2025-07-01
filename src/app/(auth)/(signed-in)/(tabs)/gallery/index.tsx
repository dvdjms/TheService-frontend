import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import PhotoGrid from '@/src/components/gallery/PhotoGrid';
import FormButton from '@/src/components/ui/FormButton';
import GalleryModal from '@/src/components/gallery/GalleryModal';

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


    console.log('Selected photos:', selectedPhotos);



    const handleModal = () => {
        setModalVisible(prev => !prev);
    }

    const handleSelectClient = () => {
        handleModal();

    }

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

                    {selectMode && (
                        <View style={styles.buttonWrapper}>
                        <FormButton
                            OnPress={handleSelectClient}
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

            <GalleryModal visible={modalVisible} onSelect={handleSelectClient} onClose={handleModal} />

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
