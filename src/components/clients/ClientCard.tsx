import { Link } from 'expo-router';
import { Text, StyleSheet, Pressable } from 'react-native';


type Props = {
    client: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
};

export default function ClientCard({ client }: Props) {
    return (
        <Link href={`/clients/${client.id}`} asChild>
            <Pressable style={styles.card}>
                <Text style={styles.name}>{client.firstName} {client.lastName}</Text>
                <Text style={styles.email}>{client.email}</Text>
                <Text style={styles.phone}>{client.phone}</Text>
            </Pressable>
        </Link>

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
