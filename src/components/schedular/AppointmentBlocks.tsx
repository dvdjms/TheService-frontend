
import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { PositionedAppointment } from "../types/Service";
import { router } from "expo-router";


interface Props {
    appointments: PositionedAppointment[]
}

const AppointmentBlocks = React.memo(({ appointments }: Props) => {

    const goToAppointment = (appointmentId: string) => {     
        // use a modal and reuse appointment component
        router.push(`/clients/${1}/appointments/${appointmentId}`);
    };


    return (
        <>
            {appointments.map((app) => (
                <Pressable
                    onPress={() => goToAppointment(app.id)}
                    key={app.id || app.start_minutes}
                    style={{
                        position: 'absolute',
                        top: app.topOffset,
                        height: app.blockHeight,
                        backgroundColor: app.color,
                        borderRadius: 7,
                        padding: 7,
                        left: 62,
                        right: 5,
                        zIndex: 10,
                        borderWidth: 2,
                        borderColor: 'red'
                    }}
                >
                    <Text>{app.appointment_title}</Text>
                    {/* <Text>{app.id}</Text> */}
                </Pressable>
            ))}
        </>
    );
});



const styles = StyleSheet.create({
    modalOverlay: {
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'transparent', // white
    },
    modalContainer: {
        backgroundColor: '#ddd',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: -3 },
        // shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '400',
        paddingLeft: 20,
        paddingBottom: 10
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    nonBlockingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        zIndex: 10, // make sure it's on top
    },
    addClientContainer: {
        flexDirection: 'row',
        paddingLeft: 20
    },
});

export default AppointmentBlocks;