import { Text, View, StyleSheet, Dimensions, Modal } from "react-native";
import { ClientList } from "@/src/components/clients";
import { colors } from '@/src/styles/globalStyles';
import { AddButton } from "@/src/components/ui/AddButton";
import { useState } from "react";
import ClientForm from "@/src/components/forms/ClientForm";
import { router } from "expo-router";
import { Client } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";

const screenWidth = Dimensions.get('window').width;

export default function ClientScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [newClientName, setNewClientName] = useState('');


    const goToClient = (client: Client) => {
        if (!client) return;
        useUserDataStore.getState().setSelectedClient(client); // 💾 store in Zustand
        router.push(`/clients/${client.clientId}`);
    };


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
                <View style={styles.underline} />
            </View>
    
            <AddButton 
                onPress={handleAddClient}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 20,
                    zIndex: 10,
                }}
            />

            <View style={{ flex: 1, width: screenWidth-5 }}>
                <ClientList goToClient={goToClient}/>
            </View>


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
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        letterSpacing: 1,
        paddingTop: 7
    },
    underline: {
        marginTop: 6,
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#007AFF', // iOS blue accent color
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


