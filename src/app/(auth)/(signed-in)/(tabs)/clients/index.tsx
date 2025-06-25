import { Text, View, StyleSheet, Dimensions, Modal } from "react-native";
import { ClientList } from "@/src/components/clients";
import { colors } from '@/src/styles/globalStyles';
import { AddButton } from "@/src/components/ui/AddButton";
import { useEffect, useState } from "react";
import ClientForm from "@/src/components/forms/ClientForm";
import { useAuth } from "@/src/context/authContext";
import { getAllClients } from "@/src/api/clients";
import { router } from "expo-router";
import { Client } from "@/src/components/types/Service";
import { useClientStore } from "@/src/store/clientStore";


const screenWidth = Dimensions.get('window').width;

export default function ClientScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const { userId, accessToken } = useAuth();

    const { setClients } = useClientStore();

    useEffect(() => {
        if(!accessToken){
            console.log("Missing access token");
            return;
        }

        const fetchClients = async () => {
            try {
                const response = await getAllClients(userId, accessToken);
                const fetchedClients = response.clients || []

                setClients(fetchedClients); // ✅ store in Zustand
            } catch (error) {
                console.error('Failed to fetch clients', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClients()
    },[accessToken, userId])

    if(loading) {
        return <View><Text>Loading...</Text></View>;
    }


    const goToClient = (client: Client) => {
        if (!client) return;
        useClientStore.getState().setSelectedClient(client); // 💾 store in Zustand
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
                <AddButton onPress={handleAddClient}/>
            </View>
    
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


