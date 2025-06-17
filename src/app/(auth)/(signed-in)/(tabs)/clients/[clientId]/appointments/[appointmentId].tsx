import { Text, View, StyleSheet, ScrollView } from "react-native";
import { colors } from '@/src/styles/globalStyles';
import { router, useLocalSearchParams } from "expo-router";
import dummyAppointments from "@/assets/mock-clients.json";
import { format } from "date-fns";
import FormButton from "@/src/components/ui/FormButton";


export default function AppointmentDetail() {
    const { clientId, appointmentId } = useLocalSearchParams();

    const appointment = dummyAppointments
        .find(c => c.id === clientId)
        ?.appointments.find(a => a?.id === appointmentId);

    if (!appointment) {
        return (
        <View>
            <Text>Appointment not found.</Text>
            <View style={styles.buttonContainer}>
                <FormButton title="Close" OnPress={() => router.back()} width={0.9} />
            </View>
        </View>
        );
    }

    
    return (
        <>
        <ScrollView>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {appointment.appointment_title}
            </Text>
            <Text>
                {format(appointment.start_minutes, 'eeee dd MMM yyyy HH:mm')} -{' '}
                {format(appointment.end_minutes, 'HH:mm')}
            </Text>
            {/* Example images */}
            {/* {appointment.photos?.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={{ width: '100%', height: 200, marginVertical: 10 }} />
            ))} */}
        </ScrollView>

        <View style={styles.buttonContainer}>
            <FormButton title="Close" OnPress={() => router.back()} width={0.9} />
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
    },
});