import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import PhotoThumbnail from './PhotoThumbnail';


type PhotoGridProps = {
    photos: string[];
    selectMode: boolean;
    selectedPhotos: string[];
    onSelect?: (uri: string) => void;
    onPreview?: (uri: string) => void;
};

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const size = screenWidth / numColumns -35;


export default function PhotoGrid({ photos, selectedPhotos, selectMode, onSelect, onPreview }: PhotoGridProps) {
    
    return (
        <FlatList
            data={photos}
            keyExtractor={(item) => item}
            numColumns={numColumns}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
                <PhotoThumbnail
                    photoUri={item}
                    isSelected={selectedPhotos.includes(item)}
                    selectMode={selectMode}
                    onPress={() => selectMode ? onSelect?.(item) : onPreview?.(item)}
                />
            )}
        />
    );
}


const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    photoWrapper: {
        margin: 5,
    },
    photo: {
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: '#ccc',
    },
});
