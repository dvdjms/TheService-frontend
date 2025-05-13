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
        padding: 16,
        width: '100%',

    },
    clientCard: {
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
