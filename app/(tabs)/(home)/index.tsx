import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/src/context/authContext';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
    const { firstName } = useAuth();
  return (
    <View style={styles.container}>
        <Text>Welcome, {firstName}!</Text>
        <Text style={styles.titleContainer}>The Service</Text>
    </View>

  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0dd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
        gap: 8,
        fontSize: 22,
    },
});
