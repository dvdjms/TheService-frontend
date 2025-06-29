import { FlatList } from 'react-native';
import ClientCard from './ClientCard';
import { Client } from '../types/Service';
import { useUserDataStore } from '@/src/store/useUserDataStore';


interface Props {
    goToClient: (client: Client) => void;
}

export default function ClientList({ goToClient }: Props) {

    const clients = useUserDataStore(state => state.clients);
    
    return (
        <FlatList
            data={clients}
            keyExtractor={(item) => item.clientId}
            renderItem={({ item }) => <ClientCard client={item} goToClient={goToClient} />}
            contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
        />
    );
}
