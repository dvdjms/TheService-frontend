import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from '@/src/styles/globalStyles';
import { router, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import FormButton from "@/src/components/ui/FormButton";
import { useEffect, useState } from "react";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import { useAuth } from "@/src/context/authContext";
import { deleteAppointment, getAppointment } from "@/src/api/appts";
import { Ionicons } from "@expo/vector-icons";


export default function AppointmentDetail() {
    const { userId, accessToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(false)
    const { clientId, appointmentId } = useLocalSearchParams();
    const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId;
    const apptIdString = Array.isArray(appointmentId) ? appointmentId[0] : appointmentId;
    const accessTokenString = Array.isArray(accessToken) ? accessToken[0] : accessToken;

    const selectedAppt = useUserDataStore(state => state.getApptById(apptIdString));
    const setSelectedClient = useUserDataStore(state => state.setSelectedClient);
    
    let clientName = '';
    if (selectedAppt?.clientId) {
        const client = useUserDataStore.getState().getClientById(selectedAppt.clientId);
        if (client) {
            clientName = `${client.firstName}`;
        }
    }

    useEffect(() => {
        // If no client in store or different clientId, fetch client from API
        if (!selectedAppt || selectedAppt.apptId !== clientIdString) {
            setLoading(true);
            const fetchClients = async () => {
                if(accessToken){
                    const client = await getAppointment(userId, clientIdString, apptIdString, accessToken);
                    setSelectedClient(client)
                }
            }
            setLoading(false);
            fetchClients()
        }
    }, [clientIdString, accessToken]);


    const handleDelete = async () => {
        const response = await deleteAppointment(userId, clientIdString, apptIdString, accessTokenString);
        console.log("AWS StatusCode:", response.appointment.$metadata.httpStatusCode, "message:", response.message)
        if(response.appointment) useUserDataStore.getState().removeAppt(apptIdString);
        router.back();
    }


    if (loading) return <View></View>//LoadingSpinner />;

    if (!selectedAppt) return <Text>No client found</Text>;

    if (!selectedAppt) {
        return (
        <View>
            <Text>Appointment not found.</Text>
            <View style={styles.buttonContainer}>
                <FormButton title="Close" OnPress={() => router.push(`/clients/${clientIdString}`)} width={0.9} />
            </View>
        </View>
        );
    }

    
    return (
        <>
        <ScrollView>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {selectedAppt.title}
            </Text>
            <Text>
                {format(selectedAppt.startTime, 'eeee dd MMM yyyy HH:mm')} -{' '}
                {format(selectedAppt.endTime, 'HH:mm')}
            </Text>
            {/* Example images */}
            {/* {appointment.photos?.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={{ width: '100%', height: 200, marginVertical: 10 }} />
            ))} */}
        </ScrollView>
            <Ionicons name={"close-outline"} size={35}></Ionicons>
            <TouchableOpacity onPress={() => handleDelete()}>
                <Ionicons name={"trash-outline"} size={35} ></Ionicons>
            </TouchableOpacity>
        <View style={styles.buttonContainer}>
            <FormButton title="Back" OnPress={() => router.back()} width={0.3}/>
            <FormButton title="All Clients" OnPress={() => router.push(`/clients`)} width={0.3} />
            <FormButton title={clientName} OnPress={() => router.push(`/clients/${selectedAppt.clientId}`)} width={0.3} />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
        gap: 8,
        fontSize: 22,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});