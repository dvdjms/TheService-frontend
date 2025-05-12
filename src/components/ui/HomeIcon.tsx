import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

export default function HomeIcon({ onPress }: { onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={styles.iconContainer}>
            <Ionicons name="home-outline" style={styles.icon} size={30}/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        paddingRight: 15, 
    },
    icon: {
        color: "#3478f7"
    }
});
