import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '@/src/context/authContext';


export default function HomeScreen() {
    const { firstName, email } = useAuth();
    return (

        <View style={styles.container}>
            <Text>Welcome, {firstName}!</Text>
            <Text>Email: {email}!</Text>
            <Text style={styles.titleContainer}>The Service</Text>

            <TouchableOpacity style={styles.button} onPress={() => alert('Pressed!')}>
                <Text style={styles.buttonText}>Custom Button</Text>
            </TouchableOpacity>
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
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
