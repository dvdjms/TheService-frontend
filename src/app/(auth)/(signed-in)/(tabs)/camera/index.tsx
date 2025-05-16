import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';



export default function CameraScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="Grant Permission" />
        </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            const localUri = photo.uri;

            // Create an app-specific directory (if it doesn't exist)
            const folderUri = FileSystem.documentDirectory + 'photos/';
            const filename = `photo_${Date.now()}.jpg`;
            const newPath = folderUri + filename;

            // Ensure folder exists
            const folderInfo = await FileSystem.getInfoAsync(folderUri);
            if (!folderInfo.exists) {
                await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
            }

            // Move photo to new path
            await FileSystem.moveAsync({
                from: localUri,
                to: newPath,
            });

            console.log('Photo saved to:', newPath);
        }
    };

    return (
  <View style={styles.container}>
    <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

    <View style={styles.sideButtonWrapper}>
      <TouchableOpacity onPress={toggleCameraFacing} style={styles.sideButton}>
        <Ionicons name="camera-reverse-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={takePicture} style={styles.shutterButton}>
      <View style={styles.innerShutter} />
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    sideButtonWrapper: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    sideButton: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shutterButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerShutter: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});
