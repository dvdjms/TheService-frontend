import { SectionList, Text, StyleSheet, View } from 'react-native';
import { Appointment } from '../types/Service';
import { useUserDataStore } from '@/src/store/zustand/useUserDataStore';
import ApptCard from './ApptCardDashBoard';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';


export default function DashboardList() {

    const appts = useUserDataStore(state => state.appts);

    const groupAppointmentsByDate = (appts: Appointment[]) => {
        const groups: { [date: string]: Appointment[] } = {};

        for (const appt of appts) {
            const dateKey = dayjs(appt.startTime).format('YYYY-MM-DD');
            if (!groups[dateKey]) groups[dateKey] = [];
                groups[dateKey].push(appt);
        }

        dayjs.extend(isSameOrAfter);
        // Convert to SectionList format
        return Object.entries(groups)
            .filter(([date]) => dayjs(date).isSameOrAfter(dayjs(), 'day'))
            .sort(([a], [b]) => dayjs(a).unix() - dayjs(b).unix())
            .map(([date, data]) => ({
                title: dayjs(date).format('dddd, D MMM YYYY'),
                data: data.sort((a, b) => a.startTime - b.startTime), 
            })
        );
    };

    const sections = groupAppointmentsByDate(appts);

    const goToAppt = (appt: Appointment) => {
        if (!appt) return;
        useUserDataStore.getState().setSelectedAppt(appt); // 💾 store in Zustand
        router.push(`/clients/${appt.clientId}/appointments/${appt.apptId}`);
    };

    
    if(!sections.length) {
        return ( 
            <View style={{flex: 1, paddingTop: 50}}>
                <Text style={styles.EmptyMessage}>No appointments scheduled</Text>
            </View>
        )
    }

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.apptId}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={({ item }) => (
                <ApptCard appt={item} goToAppt={goToAppt}></ApptCard>
            )}
            showsVerticalScrollIndicator={false}  
            style={styles.sectionList}
        />
    );
}


const styles = StyleSheet.create({
    sectionList: {
        backgroundColor: '#f2f2f7',
        paddingHorizontal: 20,
        paddingTop: 10,
        flex: 1,
        width: '90%',
    },
    sectionHeader: {
        fontWeight: '700',
        fontSize: 20,
        color: '#1c1c1e',
        paddingVertical: 12,
        paddingHorizontal: 20,
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
    EmptyMessage: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});
