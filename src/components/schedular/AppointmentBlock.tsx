import { useState } from "react";
import { View, StyleSheet, TextInput, Text, Dimensions, TouchableOpacity } from "react-native";
import { yToTime, yToTime11 } from '../utils/timeUtils';
import { TimeBlock } from "../types/Service";

import { runOnJS, runOnUI, SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_COLLAPSED_HEIGHT = 30;
const MODAL_EXPANDED_HEIGHT = 200;

interface AppointmentBlockProps {
    onSave: (title: string) => void;
    selectedTimeBlock: SharedValue<TimeBlock>;
    selectedDate: number;
    isModalExpanded: SharedValue<boolean>;
    isModalVisible: SharedValue<boolean>;
}   

const AppointmentBlock = ({ onSave, selectedDate, selectedTimeBlock, isModalVisible, isModalExpanded }: AppointmentBlockProps) => {
    const [title, setTitle] = useState('');
    const [displayBlock, setDisplayBlock] = useState<TimeBlock>();
    const [expandedJS, setExpandedJS] = useState(false);
    // const expanded = useSharedValue(false);

    //convert to date
    const newDate = new Date(selectedDate);

    useAnimatedReaction(
        () => selectedTimeBlock.value,
        (block) => {
            if(block) runOnJS(setDisplayBlock)(block);
        }
    );

    useAnimatedReaction(
        () => isModalExpanded.value,
        (value) => {
            runOnJS(setExpandedJS)(value);
        },
    );


    const handleClose = () => {
        runOnUI(() => {
            isModalExpanded.value = false;
            isModalVisible.value = false;
            selectedTimeBlock.value = {
                ...selectedTimeBlock.value,
                startMinutes: null,
                endMinutes: null,
            };
        })();
    };


    const handleSave = () => {
        onSave(title);
        handleClose();
    };


    return (

        <View style={[styles.modalOverlay]}>
            {isModalVisible && (
            <>
                <TouchableOpacity
                    onPress={() => {
                        isModalExpanded.value = !isModalExpanded.value;
                    }}
                    style={styles.chevron}
                    >
                    <Ionicons name={expandedJS ? "chevron-down" : "chevron-up"} size={24} />
                    <Text style={{textAlign: 'center'}}>{expandedJS ? "" : "(No title)"}  </Text>
                </TouchableOpacity>

                {expandedJS && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.buttons}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleSave}>
                                <Text style={styles.buttons}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={ styles.label }>
                            {displayBlock?.date ? format(displayBlock?.date, 'eeee dd MMM yyy') : 'no date selected'}
                            {"  •  "}
                            {displayBlock?.startMinutes  ? yToTime11(displayBlock.startMinutes) : '--:--'}
                            {" – "}
                            {displayBlock?.endMinutes ? yToTime11(displayBlock.endMinutes) : '--:--'}
                        </Text>
                        {/* <Text>selectedDate: {newDate.toString()}</Text> */}
                        {/* <Text>displayBlock: {displayBlock?.date ? format(displayBlock?.date, 'eee dd MMM yyy') : '---'}</Text> */}
                        

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
                    </View>
                )}
            </>
            )}
        </View>  

    )
};


const styles = StyleSheet.create({
    modalOverlay: {
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'transparent', // white
        justifyContent: 'center'
    },
    modalContainer: {
        backgroundColor: '#ddd',
        padding: 20,
        paddingTop: 40,
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: -22,
        paddingStart: 25,
        paddingEnd: 25,
    },
    buttons: {
        color: 'blue'
    },
    chevron: {
        position: 'absolute',
        top: 5,
        alignSelf: 'center',
        zIndex: 100,
        alignItems: 'center',
    }
});

export default AppointmentBlock;