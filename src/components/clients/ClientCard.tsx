import { Text, StyleSheet, Pressable } from 'react-native';
import { Client } from '../types/Service';


type Props = {
    client: Client
    goToClient: (client: Client) => void;
};


export default function ClientCard({ client, goToClient }: Props) {

    return (
        <Pressable style={styles.card} onPress={() => goToClient(client)}>
            <Text style={styles.name}>{client.firstName} {client.lastName}</Text>
            <Text style={styles.email}>{client.email}</Text>
            <Text style={styles.phone}>{client.phone}</Text>
            <Text style={styles.phone}>{client.clientId}</Text>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#F2F2F2',
        borderRadius: 8,
        width: '100%',
        alignSelf: 'center'
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    phone: {
        fontSize: 14,
        color: '#888',
    },
});
