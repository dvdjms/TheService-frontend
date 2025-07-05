import { Text, StyleSheet, Pressable, View, TouchableOpacity } from 'react-native';
import { Appointment } from '../types/Service';
import dayjs from 'dayjs';
import { useUserDataStore } from '@/src/store/zustand/useUserDataStore';


type Props = {
    appt: Appointment;
    goToAppt: (appt: Appointment) => void;
};


export default function ApptCard({ appt, goToAppt }: Props) {

    const client = useUserDataStore.getState().getClientById(appt.clientId);

    return (
        <TouchableOpacity style={styles.card} onPress={() => goToAppt(appt)}>
            <View  style={[styles.innerCard, {borderWidth: 2, borderColor: appt.colour}]}>
            {/* <View  style={styles.innerCard}> */}
                <Text style={styles.title}>{appt.title}</Text>
                <Text style={styles.clientName}>{client?.firstName} {client?.lastName}</Text>
                <Text style={styles.timeText}>
                    {dayjs(appt.startTime).format('HH:mm')} – {dayjs(appt.endTime).format('HH:mm')}
                </Text>
            </View>
            {/* <Text style={styles.email}>{appt.clientId}</Text> */}

        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 8,
    },
    innerCard: {
        padding: 12,
        paddingLeft: 20,
        borderRadius: 16,
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
        marginBottom: 6,
    },
    clientName: {
        fontSize: 15,
        fontWeight: '400',
        // color: '#6e6e73',
        marginBottom: 10,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',

    },
});
