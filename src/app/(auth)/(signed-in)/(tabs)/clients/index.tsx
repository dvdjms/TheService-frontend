import { Text, View, StyleSheet, Dimensions, Modal, TextInput, TouchableOpacity } from "react-native";
import { ClientList } from "@/src/components/clients";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from '@/src/styles/globalStyles';
import { AddButton } from "@/src/components/ui/AddButton";
import { useState } from "react";

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
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Client</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Client Name"
                            value={newClientName}
                            onChangeText={setNewClientName}
                            autoFocus
                        />
                        
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.button, styles.addButton, !newClientName.trim() && styles.disabledButton]}
                                onPress={handleAddClient}
                                disabled={!newClientName.trim()}
                            >
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
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
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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

