import { Text, View, StyleSheet, Dimensions, Modal, TextInput, TouchableOpacity } from "react-native";
import { ClientList } from "@/src/components/clients";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from '@/src/styles/globalStyles';
import { AddButton } from "@/src/components/ui/AddButton";
import { useState } from "react";
import ClientForm from "@/src/components/forms/ClientForm";

const screenWidth = Dimensions.get('window').width;

export default function ClientScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [newClientName, setNewClientName] = useState('');

    const handleAddClient = () => {
        //open modal form for add client
        console.log('Adding new client:', newClientName);
        setModalVisible(true);
        setNewClientName('');
    }

    return (
        <View style={styles.container}>

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Clients</Text>
                <AddButton onPress={handleAddClient}/>
            </View>
    
            <ScrollView contentContainerStyle={{ flexGrow: 1, width: screenWidth-5 }}>
                <ClientList />
            </ScrollView>


            {/* Add Client Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                // onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ClientForm setModalVisible={setModalVisible} />
                    </View>
                </View>
            </Modal>
         </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: screenWidth,
    },
    title: {
        color: 'red',
        gap: 8,
        fontSize: 22,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        flex: 1,
        top: 70,
        width: screenWidth,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#4CAF50',
    },
    addButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

