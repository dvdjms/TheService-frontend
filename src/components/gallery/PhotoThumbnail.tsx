import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

interface PhotoThumbnailProps {
    photoUri: string;
    isSelected: boolean;
    selectMode: boolean;
    onPress: () => void;
}

export default function PhotoThumbnail({ photoUri, isSelected, selectMode, onPress }: PhotoThumbnailProps) {
    return (

        <TouchableOpacity 
            onPress={onPress}
        >
            <Image source={{ uri: photoUri }} style={styles.container} />

            {selectMode && isSelected && (
                <View style={styles.checkmarkWrapper}>
                    <Ionicons 
                        name="checkmark-circle"
                        size={20} 
                        color="white" />
                </View>
            )}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 120,
        height: 120,
        padding: 3,
        borderRadius: 3,
    },
    checkmarkWrapper: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 128, 0, 0.7)',
        borderRadius: 12,
        padding: 2,
        zIndex: 1,
    },
});
