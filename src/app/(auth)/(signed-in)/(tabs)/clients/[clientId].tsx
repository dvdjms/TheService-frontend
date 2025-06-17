import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Pressable, InteractionManager } from 'react-native';
import FormButton from '@/src/components/ui/FormButton';
import { colors } from '@/src/styles/globalStyles';
import dummyAppointments from "@/assets/mock-clients.json";
import { FlatList } from 'react-native-gesture-handler';
import { Appointment } from '@/src/components/types/Service';
import { format } from 'date-fns';



export default function ClientDetail() {
    const router = useRouter();
    const { clientId } = useLocalSearchParams();

    const client = dummyAppointments.find(c => c.id === clientId);


    const goToAppointment = (appointmentId: string) => {          
        router.push(`/clients/${clientId}/appointments/${appointmentId}`);
    };

    if (!client) {
        return (
            <View>
                <Text>Client not found</Text>
                <Button title="Close" onPress={() => router.back()} />
            </View>
        );
    }

    const sortedAppointments = [...client.appointments].sort(
        (a, b) => a.start_minutes - b.start_minutes
    );


    const renderItem = ({ item }: { item: any}) => (
        <View style={styles.appointment}>
            <Pressable onPress={() => goToAppointment(item.id)} style={styles.card} >
                <View>
                    <Text style={{ fontWeight: 'bold' }}>
                        {item.appointment_title.split('\n')[0]}
                    </Text>
                    <Text>
                        {format(item.start_minutes, 'eeee dd MMMM yyyy HH:mm')} -{' '}
                        {format(item.end_minutes,'HH:mm')}
                    </Text>
                
                </View>
            </Pressable>
        </View>
    );

    return (
   
        <View style={styles.container}>
            <View style={styles.details}>
                <Text style={styles.title}>Client Detail Screen</Text>
                <Text>Name: {client.firstName} {client.lastName}</Text>
                <Text>Email: {client.email}</Text>
                <Text>Phone: {client.phone}</Text>
            </View>

            <View style={styles.appointmentsContainer}>
                <FlatList 
                    data={sortedAppointments}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    style={styles.FlatList}
                />
              
            </View>
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