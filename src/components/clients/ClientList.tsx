import { FlatList, View, Text, StyleSheet } from 'react-native';
import ClientCard from './ClientCard';
import { Client } from '../types/Service';
import { useUserDataStore } from '@/src/store/useUserDataStore';


interface Props {
    goToClient: (client: Client) => void;
}

export default function ClientList({ goToClient }: Props) {

    const clients = useUserDataStore(state => state.clients);
    

    if(!clients.length) {
        return ( 
            <View style={{flex: 1, paddingTop: 50}}>
                <Text style={styles.EmptyMessage}>No Clients to list</Text>
            </View>
        )
    }
    
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


const styles = StyleSheet.create({
    EmptyMessage: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});