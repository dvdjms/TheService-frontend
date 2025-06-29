import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Pressable, TouchableOpacity, Dimensions } from 'react-native';
import FormButton from '@/src/components/ui/FormButton';
import { colors } from '@/src/styles/globalStyles';
import { FlatList } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { deleteClient, getClient } from '@/src/api/clients';
import { useAuth } from '@/src/context/authContext';
import { useUserDataStore } from '@/src/store/useUserDataStore';
import { Appointment } from '@/src/components/types/Service';
import { Ionicons } from '@expo/vector-icons';
import ApptCard from '@/src/components/dashboard/ApptCard';
import { CustomContact } from '@/src/components/ui/CustomContact';


export default function ClientDetail() {
    const { userId, accessToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { clientId } = useLocalSearchParams();
    const accessTokenString = Array.isArray(accessToken) ? accessToken[0] : accessToken;
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


    const goToAppt = (appt: Appointment) => {   
        if (!appt) return;
        useUserDataStore.getState().setSelectedAppt(appt); // 💾 store in Zustand
        router.push(`/clients/${clientId}/appointments/${appt.apptId}`);
    };


    const handleDelete = async () => {
        console.log('handleDelete client triggered')
        const response = await deleteClient(userId, clientIdString, accessTokenString);
        console.log("AWS response:", response.message)
        if(response.client) useUserDataStore.getState().removeClient(clientIdString);
        
        router.back();
    }

    const onPress = () => {

    }


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
            <ApptCard appt={item} goToAppt={goToAppt}></ApptCard>
        </View>
    );

    return (
   
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{selectedClient.firstName} {selectedClient.lastName}</Text>
                <Text style={styles.email}>{selectedClient.email}</Text>

                <View style={styles.contactContainer}>
                    <CustomContact title={"Message"} name={"chatbubble-outline"} value={selectedClient.email} onPress={(onPress)}/>
                    <CustomContact title={"Call"} name={"call-outline"} value={selectedClient.phone} onPress={(onPress)}/>
                    <CustomContact title={"Email"} name={"mail-outline"} value={selectedClient.email} onPress={(onPress)}/>
                </View>
            </View>

        {clientAppts.length ? (
            <View style={styles.appointmentsContainer}>
                <FlatList 
                    data={clientAppts}
                    keyExtractor={item => item.apptId}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}  
                    style={styles.FlatList}
                />
            </View>
            ) : (
                <Text>No appointments found </Text>

            )}
              <Text>Add appointment +</Text>


            <TouchableOpacity onPress={() => handleDelete()}>
                <Ionicons name={"trash-outline"} size={35} ></Ionicons>
            </TouchableOpacity>
            
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
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    titleContainer: {
        backgroundColor: '#f2f2f7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        letterSpacing: 1,
        paddingTop: 7
    },
    email: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111',
        paddingTop: 7
    },
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        width: '95%',
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
       height: 400,
    },
    appointment: {
        padding: 8,
        gap: 5,
        // marginBottom: 5,
        // height: 60,
        borderRadius: 5,
        backgroundColor: colors.background,

    },
    card: {
        borderRadius: 8,
        width: '95%',
        alignSelf: 'center'
    },
});