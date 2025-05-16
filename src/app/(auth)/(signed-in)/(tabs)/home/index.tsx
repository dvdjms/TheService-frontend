import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/src/context/authContext';
import { colors } from '@/src/styles/globalStyles';

export default function HomeScreen() {
    const { firstName, email, subscriptionTier } = useAuth();

    const handleSubmit = () => {


    }
    
    return (

        <View style={styles.container}>
            <Text style={styles.titleContainer}>The Service</Text>
            <Text>Welcome, {firstName}!</Text>
            <Text>Email: {email}!</Text>
            <Text>subscriptionTier: {subscriptionTier}!</Text>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
