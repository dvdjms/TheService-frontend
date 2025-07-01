import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Appointment } from '../types/Service';
import dayjs from 'dayjs';

type Props = {
    appt: Appointment;
    goToAppt: (appt: Appointment) => void;
};


export default function ApptCard({ appt, goToAppt }: Props) {

    return (
        <TouchableOpacity style={styles.card} onPress={() => goToAppt(appt)}>
            <View  style={[styles.innerCard, {borderWidth: 2, borderColor: appt.colour}]}>
                <View style={styles.dateRow}>
                    <Text style={styles.timeText}>
                        {dayjs(appt.startTime).format('ddd, DD MMMM YYYY')}
                    </Text>
                    <Text style={styles.timeText}>
                        {dayjs(appt.startTime).format('HH:mm')} – {dayjs(appt.endTime).format('HH:mm')}
                    </Text>
                </View>
                <Text style={styles.title}>{appt.title}</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        marginVertical: 3,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 8,
    },
    innerCard: {
        padding: 8,
        paddingLeft: 17,
        paddingRight: 17,
        borderRadius: 16,
        paddingBottom: 4,
        backgroundColor: 'transparent',
        gap: 7
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
        marginBottom: 6,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
