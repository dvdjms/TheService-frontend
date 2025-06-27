import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import FormButton from '@/src/components/ui/FormButton';
import { colors } from '@/src/styles/globalStyles';
import { FlatList } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getClient } from '@/src/api/clients';
import { useAuth } from '@/src/context/authContext';
import { useUserDataStore } from '@/src/store/useUserDataStore';
import { Appointment } from '@/src/components/types/Service';


export default function ClientDetail() {
    const { userId, accessToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { clientId } = useLocalSearchParams();
    const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId;
    const selectedClient = useUserDataStore(state => state.getClientById(clientIdString));
    const setSelectedClient = useUserDataStore(state => state.setSelectedClient);
    const appts = useUserDataStore(state => state.appts);

    const clientAppts = appts.filter(c => c.clientId === clientIdString);

    useEffect(() => {
        // If no client in store or different clientId, fetch client from API
        if (!selectedClient || selectedClient.clientId !== clientIdString) {
            setLoading(true);
            const fetchClients = async () => {
                if(accessToken){
                    const client = await getClient(userId, clientIdString, accessToken);
                    setSelectedClient(client)
                }
            }
            setLoading(false);
            fetchClients()
        }
    }, [clientIdString, accessToken]);

    if (loading) return <View></View>//LoadingSpinner />;

    if (!selectedClient) return <Text>No client found</Text>;


    const goToAppointment = (appt: Appointment) => {   
        if (!appt) return;
        useUserDataStore.getState().setSelectedAppt(appt); // 💾 store in Zustand
        router.push(`/clients/${clientId}/appointments/${appt.apptId}`);
    };


    if (!selectedClient) {
        return (
            <View>
                <Text>Client not found</Text>
                <Button title="Close" onPress={() => router.back()} />
            </View>
        );
    }


    const renderItem = ({ item }: { item: any}) => (
        <View style={styles.appointment}>
            <Pressable onPress={() => goToAppointment(item)} style={styles.card} >
                <View>
                    <Text style={{ fontWeight: 'bold' }}>
                        {item.title.split('\n')[0]}
                    </Text>
                    <Text>
                        {format(item.startTime, 'eeee dd MMMM yyyy HH:mm')} -{' '}
                        {format(item.endTime,'HH:mm')}
                    </Text>
                
                </View>
            </Pressable>
        </View>
    );

    return (
   
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.title}>Client Detail Screen</Text>
                <Text>Name: {selectedClient.firstName} {selectedClient.lastName}</Text>
                <Text>Email: {selectedClient.email}</Text>
                <Text>Phone: {selectedClient.phone}</Text>
            </View>

        {clientAppts.length ? (
            <View style={styles.appointmentsContainer}>
                <FlatList 
                    data={clientAppts}
                    keyExtractor={item => item.apptId}
                    renderItem={renderItem}
                    style={styles.FlatList}
                />
              
            </View>
            ) : (
                <Text>No appointments found </Text>

            )}
              <Text>Add appointment +</Text>

            <View style={styles.buttonContainer}>
                <FormButton title="Close" OnPress={() => router.back()} width={0.9} />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    appointmentsContainer: {
        // borderWidth: 1,
        // borderColor: 'red'
    },
    FlatList: {

    },
    appointment: {
        padding: 8,
        gap: 5,
        marginBottom: 5,
        height: 60,
        borderRadius: 5,
        backgroundColor: 'brown'

    },
    card: {
        // marginBottom: 16,
        // padding: 12,
        // backgroundColor: '#F2F2F2',
        borderRadius: 8,
        width: '95%',
        alignSelf: 'center'
    },
});