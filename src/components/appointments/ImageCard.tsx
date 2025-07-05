import { Text, StyleSheet, Pressable, TouchableOpacity, View } from 'react-native';
import { Client } from '../types/Service';


type Props = {
    client: Client
    // goToClient: (client: Client) => void;
};


export default function ImageCard({ client }: Props) {

    return (
        <View><Text>Image List</Text></View>
        // <TouchableOpacity style={styles.card} >
        //     <Text style={styles.name}>{client.firstName} {client.lastName}</Text>
        //     <Text style={styles.email}>{client.email}</Text>
        //     <Text style={styles.phone}>{client.phone}</Text>
        //     <Text style={styles.phone}>{client.clientId}</Text>
        // </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginVertical: 8,
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4, // Android shadow
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    phone: {
        fontSize: 14,
        color: '#666',
    },
    clientId: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 4,
    }
});

