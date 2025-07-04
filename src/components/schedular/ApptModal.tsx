import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";
import { yToTime, yToTime11 } from '../utils/timeUtils';
import { Client, TimeBlock } from "../types/Service";
import { runOnJS, runOnUI, SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { convertMinutesToTimeStamp } from "../utils/timeBlockUtils";
import { useAuth } from "@/src/context/authContext";
import ClientSelectModal from "@/src/components/schedular/ClientSelectModal";
import ColourSelectModal from "./ColorSelectModal";
import { colors } from "@/src/styles/globalStyles";
import { saveAppt } from "@/src/store/appts/apptController";


interface AppointmentBlockProps {
    selectedTimeBlock: SharedValue<TimeBlock>;
    isModalVisible: SharedValue<boolean>;
    isModalExpanded: SharedValue<boolean>;
}   

const AppointmentBlock = ({ selectedTimeBlock, isModalVisible, isModalExpanded }: AppointmentBlockProps) => {
    const [title, setTitle] = useState<string>('');
    const [displayBlock, setDisplayBlock] = useState<TimeBlock>();
    const [expandedJS, setExpandedJS] = useState<boolean>(false);
    const [showClientModal, setShowClientModal] = useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showColourPicker, setShowColourPicker] = useState<boolean>(false)
    const [selectedColour, setSelectedColour] = useState<string>('#fb7185')
    const { userId, accessToken, subscriptionTier } = useAuth();

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


    const handleSave = async () => {
        const date = displayBlock?.date;
        const startMinutes = displayBlock?.startMinutes;
        const endMinutes = displayBlock?.endMinutes;

        const notes = ''; ///////////////////// to do //////////////
        
        if(!title || !selectedClient){
            console.log('please add both title and client');
            // create on screen display

            return;
        }
        
        if (!date || !startMinutes || !endMinutes) return;

        const startTime = convertMinutesToTimeStamp(date, startMinutes);
        const endTime = convertMinutesToTimeStamp(date, endMinutes);

        if (!startTime || !endTime) return;

        const appointmentData = {
            userId: userId,
            clientId: selectedClient.clientId,
            title: title,
            notes: notes,
            startTime: startTime,
            endTime: endTime,
            startMinutes: startMinutes,
            endMinutes: endMinutes,
            colour: selectedColour,
        };

        try {
            if(accessToken && subscriptionTier){
                const response = await saveAppt(appointmentData, accessToken, subscriptionTier);
                
                if (response) console.log("ApptModal: Save appt success");
                
                setTitle("");
                setSelectedClient(null);
                handleClose();
            }

        } catch (error) {
            console.error("Failed to save appointment")
        }
    };


    return (
        <>
        <View style={[styles.modalOverlay]}>
            {isModalVisible.value && (
            <>
                <TouchableOpacity
                    onPress={() => {
                        isModalExpanded.value = !isModalExpanded.value;
                    }}
                    style={styles.chevron}
                    >
                    <Ionicons name={expandedJS ? "chevron-down" : "chevron-up"} size={24} />
                    <Text style={{textAlign: 'center'}}>{expandedJS ? "" : "(No title)"}</Text>
                </TouchableOpacity>

                {expandedJS && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                onPress={() => {
                                    handleClose(),
                                    setSelectedClient(null)
                                }}>
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

                        <TextInput
                            style={styles.input}
                            placeholder="Appointment title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <View style={styles.bottomRowContainer}>
                            <TouchableOpacity style={ styles.addClientContainer } onPress={() => setShowClientModal(true)}>
                                <Ionicons name="people-outline" size={18} />
                                {selectedClient ? (
                                    <Text style={styles.label}>
                                        {selectedClient.firstName} {selectedClient.lastName}
                                    </Text>
                                ):(
                                    <Text style={ styles.label }>Add client</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={ styles.addClientContainer } onPress={() => setShowColourPicker(true)}>
                                <View style={[styles.colorSquare, { backgroundColor: selectedColour }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </>
            )}

        </View>

        <ClientSelectModal
            visible={showClientModal}
            onSelect={(client) => {
                setSelectedClient(client);
                setShowClientModal(false);
            }}
            onClose={() => setShowClientModal(false)}
        />

        <ColourSelectModal 
            visible={showColourPicker}
            onSelect={(colour) => {
                setSelectedColour(colour);
                setShowColourPicker(false);
            }}
            onClose={() => setShowColourPicker(false)}
        />

        </>
    )
};


const styles = StyleSheet.create({
    modalOverlay: {
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        // backgroundColor: 'transparent', // white
                backgroundColor: colors.companyPurple,
        justifyContent: 'center'
    },
    modalContainer: {
        backgroundColor: colors.companyPurple,//'#ddd',
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
    },
    bottomRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20
    },
    colorSquare: {
        borderWidth: 1,
        borderRadius: 2,
        height: 17,
        width: 17,
    }
});

export default AppointmentBlock;