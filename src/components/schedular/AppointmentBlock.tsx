import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput, Button, Text, Animated, Dimensions } from "react-native";
import { yToTime, yToTime11 } from '../utils/timeUtils';
import { TimeBlock } from "@/src/app/(auth)/(signed-in)/(tabs)/schedular";
import { getYFromTimeBlock } from "../utils/timeBlockUtils";

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AppointmentBlockProps {
    visible: boolean;
    hour: number;
    onClose: () => void;
    onSave: (title: string) => void;
    selectedStartY: number | null;
    selectedEndY: number | null;
    selectedTimeBlock: TimeBlock | null;
}   

const AppointmentBlock = ({ visible, hour, onClose, onSave, selectedStartY, selectedEndY, selectedTimeBlock }: AppointmentBlockProps) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [title, setTitle] = useState('');

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible])


    return (
        <Animated.View style={[styles.modalOverlay, { transform: [{ translateY }] }]}>
            <View style={styles.modalContainer}>

                <Text style={ styles.label }>Selected Time</Text>
                <Text>Start: {selectedTimeBlock !== null ? yToTime11(selectedTimeBlock.startMinutes) : '--:--'}</Text>
                <Text>End: {selectedTimeBlock !== null ? yToTime11(selectedTimeBlock.endMinutes) : '--:--'}</Text>

                <Text style={styles.modalTitle}>New Appointment at {hour}:00</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Appointment title"
                    value={title}
                    onChangeText={setTitle}
                />
                <View style={styles.modalButtons}>
                    <Button title="Cancel" onPress={onClose} />
                    <Button title="Save" onPress={() => {
                        onSave(title);
                        onClose();
                    }} />
                </View>
            </View>
        </Animated.View>    
    )
};


const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    modalContainer: {
        backgroundColor: '#ddd',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: '600',
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
});

export default AppointmentBlock;