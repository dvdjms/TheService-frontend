import { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text, Animated, Dimensions, TouchableOpacity } from "react-native";
import { yToTime, yToTime11 } from '../utils/timeUtils';
import { TimeBlock } from "../types/Service";

import { runOnJS, SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AppointmentBlockProps {
    onClose: () => void;
    onSave: (title: string) => void;
    selectedTimeBlock: SharedValue<TimeBlock>;
    selectedDate: number;
}   

const AppointmentBlock = ({ onClose, onSave, selectedDate, selectedTimeBlock }: AppointmentBlockProps) => {
    const [title, setTitle] = useState('');
    const [displayBlock, setDisplayBlock] = useState<TimeBlock>();

    //convert to date
    const newDate = new Date(selectedDate);

    useAnimatedReaction(
        () => selectedTimeBlock.value,
        (block) => {
            if(block) runOnJS(setDisplayBlock)(block);
        }
    );

    return (
        <Animated.View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

                <Text style={ styles.label }>
                    {format(newDate, 'eeee dd MMM yyy')}
                    {"  •  "}
                    {displayBlock?.startMinutes  ? yToTime11(displayBlock.startMinutes) : '--:--'}
                    {" – "}
                    {displayBlock?.endMinutes ? yToTime11(displayBlock.endMinutes) : '--:--'}
                </Text>
                <Text>selectedDate: {newDate.toString()}</Text>
                <Text>displayBlock: {displayBlock?.date ? format(displayBlock?.date, 'eee dd MMM yyy') : '---'}</Text>
                

                <TextInput
                    style={styles.input}
                    placeholder="Appointment title"
                    value={title}
                    onChangeText={setTitle}
                />

                <TouchableOpacity style={ styles.addClientContainer }>
                    <Ionicons name="people-outline" size={18} />
                    <Text style={ styles.label }>Add client</Text>
                </TouchableOpacity>


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

export default AppointmentBlock;