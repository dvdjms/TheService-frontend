import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/src/context/authContext';
import { colors } from '@/src/styles/globalStyles';
import DashboardList from '@/src/components/dashboard/DashboardList';
import ScreenTitle from '@/src/components/ui/ScreenTitle';

export default function HomeScreen() {
    const { firstName, email, subscriptionTier } = useAuth();

    const handleSubmit = () => {

    }


    return (
        <View style={styles.container}>
            <ScreenTitle title={'My schedule'}/>

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
        paddingTop: 10
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
