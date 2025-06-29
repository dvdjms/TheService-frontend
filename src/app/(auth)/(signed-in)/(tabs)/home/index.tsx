import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/src/context/authContext';
import { colors } from '@/src/styles/globalStyles';
import DashboardList from '@/src/components/dashboard/DashboardList';

export default function HomeScreen() {
    const { firstName, email, subscriptionTier } = useAuth();

    const handleSubmit = () => {

    }


    
    return (

        <View style={styles.container}>
            <Text style={styles.title}>My schedule</Text>
            <View style={styles.underline} />
            {/* <Text>Welcome, {firstName}!</Text>
            <Text>Email: {email}!</Text>
            <Text>subscriptionTier: {subscriptionTier}!</Text> */}

            <DashboardList />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7',//colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },      
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        letterSpacing: 1,
        paddingTop: 7
    },
    underline: {
        marginTop: 6,
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#007AFF', // iOS blue accent color
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
