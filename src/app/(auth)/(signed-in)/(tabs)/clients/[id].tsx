import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import clients from '../../../../../../assets/mock-clients.json';
import FormButton from '@/src/components/ui/FormButton';

export default function ClientDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const client = clients.find(c => c.id === id);
    
    if (!client) {
        return (
            <View>
                <Text>Client not found</Text>
                <Button title="Close" onPress={() => router.back()} />
            </View>
        );
    }

    return (
   
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.title}>Client Detail Screen</Text>
                <Text>Name: {client.firstName} {client.lastName}</Text>
                <Text>Email: {client.email}</Text>
                <Text>Phone: {client.phone}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <FormButton title="Close" OnPress={() => router.back()} width={0.9} />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between', // pushes button to bottom
    },
    details: {
        flexShrink: 1,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
  },
});