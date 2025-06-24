import { View, Text, StyleSheet, FlatList } from 'react-native';
// import clients from '../../../assets/mock-clients.json';
import ClientCard from './ClientCard';
import { getAllClients } from '@/src/api/clients';
import { useAuth } from '@/src/context/authContext';
import { useEffect, useState } from 'react';

export default function ClientList() {
    const [clients, setClients] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { userId, accessToken } = useAuth();

    useEffect(() => {
        if(!accessToken){
            console.log("Missing access token");
            return;
        }

        const fetchClients = async () => {
            try {
                const response = await getAllClients(userId, accessToken);
                console.log("result", response);
                setClients(response.clients || []);
        
            } catch (error) {
                console.error('Failed to fetch clients', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClients()
    },[accessToken, userId])

    if(loading) {
        return <View><Text>Loading...</Text></View>;
    }


    return (
        <FlatList
            data={clients}
            keyExtractor={(item) => item.clientId}
            renderItem={({ item }) => <ClientCard client={item} />}
            contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}
        />
    );
}

const styles = StyleSheet.create({
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
