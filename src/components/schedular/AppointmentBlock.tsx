import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput, Button, Text, Animated, Dimensions, TouchableOpacity } from "react-native";
import { yToTime, yToTime11 } from '../utils/timeUtils';
import { TimeBlock } from "@/src/components/utils/timeBlockUtils"
import { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle } from "react-native-reanimated";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AppointmentBlockProps {
    visible: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
    selectedTimeBlock: SharedValue<TimeBlock>;
    currentDate: string;
}   

const AppointmentBlock = ({ visible, onClose, onSave, currentDate, selectedTimeBlock }: AppointmentBlockProps) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [title, setTitle] = useState('');
    const [displayBlock, setDisplayBlock] = useState<TimeBlock>();

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible])


    const animatedStyle = useAnimatedStyle(() => ({
        opacity: selectedTimeBlock.value ? 1 : 0,
        transform: [{
            translateY: selectedTimeBlock.value?.startMinutes || 0,
        }],
    }));


    useAnimatedReaction(
        () => selectedTimeBlock.value,
        (block) => {
            if(block) runOnJS(setDisplayBlock)(block);
        }
    );


    return (
        <Animated.View style={[styles.modalOverlay, animatedStyle, { transform: [{ translateY }] }]}>
            <View style={styles.modalContainer}>

                <Text style={ styles.label }>
                    {format(currentDate, 'eeee dd MMM yyy')}
                    {"  •  "}
                    {displayBlock?.startMinutes  ? yToTime11(displayBlock.startMinutes) : '--:--'}
                    {" – "}
                    {displayBlock?.endMinutes ? yToTime11(displayBlock.endMinutes) : '--:--'}
                </Text>
                {/* <Text>End: {displayBlock?.endMinutes ? yToTime11(displayBlock.endMinutes) : '--:--'}</Text> */}

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