import { StyleSheet, FlatList } from 'react-native';
// import clients from '../../../assets/mock-clients.json';
import ClientCard from './ClientCard';
import { Client } from '../types/Service';
import { useClientStore } from '@/src/store/clientStore';


interface Props {
    goToClient: (client: Client) => void;
}

export default function ClientList({ goToClient }: Props) {
    const clients = useClientStore(state => state.clients);
    
    return (
        <FlatList
            data={clients}
            keyExtractor={(item) => item.clientId}
            renderItem={({ item }) => <ClientCard client={item} goToClient={goToClient} />}
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
