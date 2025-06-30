import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Pressable, TouchableOpacity, SectionList, ScrollView } from 'react-native';
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
import ApptCard from '@/src/components/dashboard/ApptCardDashBoard';
import { CustomContact } from '@/src/components/ui/CustomContact';
import ApptCardClient from '@/src/components/appoinments/ApptCardClient';
import { AddButton } from '@/src/components/ui/AddButton';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ClientAddress } from '@/src/components/clients/ClientAddress';


export default function ClientDetail() {
    const { userId, accessToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [addressActive, setAddressActive] = useState<boolean>(false)

    const { clientId } = useLocalSearchParams();
    const accessTokenString = Array.isArray(accessToken) ? accessToken[0] : accessToken;
    const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId;
    const selectedClient = useUserDataStore(state => state.getClientById(clientIdString));
    const setSelectedClient = useUserDataStore(state => state.setSelectedClient);
    const appts = useUserDataStore(state => state.appts);


    const dropdownHeight = useSharedValue(0);
    const opacity = useSharedValue(0);

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


    const handleAddAppt = () => {

    }


    const handleDelete = async () => {
        console.log('handleDelete client triggered')
        const response = await deleteClient(userId, clientIdString, accessTokenString);
        console.log("AWS response:", response.message)
        if(response.client) useUserDataStore.getState().removeClient(clientIdString);
        
        router.back();
    }

    const onPress = () => {

    }




    const toggleDropdown = () => {
        const next = !addressActive;
        setAddressActive(next);

        dropdownHeight.value = withTiming(next ? 120 : 0, { duration: 300 });
        opacity.value = withTiming(next ? 1 : 0, { duration: 300 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: dropdownHeight.value,
        opacity: opacity.value,
        overflow: 'hidden',
    }));


    if (!selectedClient) {
        return (
            <View>
                <Text>Client not found</Text>
                <Button title="Close" onPress={() => router.back()} />
            </View>
        );
    }


    const groupAppointmentsByTime = (appts: Appointment[]) => {
        const now = Date.now();
        const upcoming: Appointment[] = [];
        const past: Appointment[] = [];
        const sections = [];

        for (const appt of appts) {
            if (appt.startTime > now) {
                upcoming.push(appt);
            } else {
                past.push(appt);
            }
        }

        upcoming.sort((a, b) => a.startTime - b.startTime);
        past.sort((a, b) => b.startTime - a.startTime);

        if (upcoming.length > 0) {
            sections.push({title: 'Upcoming', data: upcoming,});
        }

        if (past.length > 0) {
            sections.push({title: 'Past',data: past,
            });
        }

        return sections;
    };

    const sections = groupAppointmentsByTime(clientAppts);

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.apptId}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                renderItem={({ item }) => (
                    <ApptCardClient appt={item} goToAppt={goToAppt}></ApptCardClient>
                )}
                ListEmptyComponent={() => (
                    <Animated.View 
                        entering={FadeIn.duration(1000)} 
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
                    >
                        <Text style={{ fontSize: 16, color: '#555' }}>No Appointments listed</Text>
                    </Animated.View>
                )} 
                
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 50 }} 
                showsVerticalScrollIndicator={false} 
                ListHeaderComponent={
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{selectedClient.firstName} {selectedClient.lastName}</Text>
                        <Text style={styles.email}>{selectedClient.email}</Text>

                        <View style={styles.contactContainer}>
                            <CustomContact title={"Message"} name={"chatbubble-outline"} value={selectedClient.email} onPress={(onPress)}/>
                            <CustomContact title={"Call"} name={"call-outline"} value={selectedClient.phone} onPress={(onPress)}/>
                            <CustomContact title={"Email"} name={"mail-outline"} value={selectedClient.email} onPress={(onPress)}/>
                        </View>

                        <ClientAddress client={selectedClient}/>
                    </View>
                }
            />

            <AddButton 
                onPress={handleAddAppt}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 15,
                    zIndex: 10,
                }}
            />

            <View style={styles.footerButtons}>
                <TouchableOpacity onPress={() => handleDelete()}>
                    <Ionicons name={"trash-outline"} size={35} ></Ionicons>
                </TouchableOpacity>
                
                <View style={styles.buttonContainer}>
                    <FormButton title="Close" OnPress={() => router.back()} width={0.9} />
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: colors.background,
        padding: 15,
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingBottom: 0, 
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
        paddingTop: 0,
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
        marginBottom: 15,
        width: '95%',
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    sectionHeader: {
        fontWeight: '700',
        fontSize: 16,
        color: '#1c1c1e',
        paddingVertical: 7,
        paddingHorizontal: 17,
        borderBottomWidth: 1,
        borderBottomColor: '#d1d1d6',
        letterSpacing: 0.5,
        backgroundColor: '#f2f2f7',
        // Add elevation/shadow for iOS/Android if needed:
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 1,
    },
    footerButtons: {
        position: 'absolute',
        bottom: 0,
        right: 20,
        left: 20,
        alignItems: 'center',
        // zIndex if needed
    }
});
