import { View, Text, StyleSheet } from 'react-native';
import clients from '../../../assets/mock-clients.json';
import ClientCard from './ClientCard';

export default function ClientList() {
    return (
        <View style={styles.container}>
        {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
        ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    clientCard: {
        flex: 1,

        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#555',
    },
    phone: {
        fontSize: 14,
        color: '#777',
    },
});
