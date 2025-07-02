import { useUserDataStore } from "@/src/store/useUserDataStore";
import { FlatList, TouchableOpacity, Text, StyleSheet, Modal, View } from "react-native"
import { Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS, withSpring } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { colors } from "@/src/styles/globalStyles";
import { Appointment, Client } from "../types/Service";
import { format } from "date-fns";


interface Props {
    visible: boolean;
    handleUpload: (client: Client, appointment: Appointment ) => void;
    onClose: () => void;
}

const screenWidth: number = Dimensions.get("window").width;
const screenHeight: number = Dimensions.get("window").height;


const GalleryModal = ({  handleUpload, visible, onClose }: Props) => {
    const clients = useUserDataStore(state => state.clients);
    const appts = useUserDataStore(state => state.appts);

    const [showModal, setShowModal] = useState(visible);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);
    const scale = useSharedValue(0.95);

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
            translateY.value = withSpring(0, {
                damping: 14,
                stiffness: 120,
                mass: 0.6,
        });
        scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
        } else {
            opacity.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) });
            translateY.value = withTiming(100, { duration: 300, easing: Easing.inOut(Easing.exp) });
            scale.value = withTiming(0.95, { duration: 300, easing: Easing.in(Easing.ease) }, (finished) => {
                if (finished) runOnJS(setShowModal)(false);
            });
            setSelectedClient(null);
        }
    }, [visible]);


    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedModalStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }, {scale: scale.value}],
    }));

    const filteredAppointments = selectedClient
        ? appts.filter(a => a.clientId === selectedClient.clientId)
        : [];


    const handleClientSelect = (client: Client) => {
        setSelectedClient(client);
    };

    
    const handleApptSelect = async (selectedAppt: Appointment) => {
        if(selectedClient && selectedAppt){
            handleUpload(selectedClient, selectedAppt);
        }
        onClose();
    };


    if (!showModal) return null;

  
    return (
        <>
        <Modal transparent visible={showModal} animationType="none" onRequestClose={onClose}>
            <Animated.View style={[styles.modalBackground, animatedBackgroundStyle]} />
            <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            {/* <Animated.View style={[styles.modalContainer, animatedContentStyle]}> */}

                {!selectedClient ? (
                    <>            
                        <Text style={styles.sectionTitle}>Select Client</Text>
                        <FlatList
                            data={clients}
                            keyExtractor={(item) => item.clientId.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleClientSelect(item)} style={styles.itemContainer}>
                                    <Text>{item.firstName} {item.lastName}</Text>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                ): (  
                    <>                
                        <TouchableOpacity onPress={() => setSelectedClient(null)} style={styles.backButton}>
                            <Text style={styles.backText}>← Back to Clients</Text>
                        </TouchableOpacity>
                        <Text style={styles.clientName}>{selectedClient.firstName} {selectedClient.lastName}</Text>
                        <Text style={styles.sectionTitle}>Select Appointment</Text>
                        <FlatList
                            data={filteredAppointments}
                            keyExtractor={(item) => item.apptId.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleApptSelect(item)} style={styles.itemContainer}>
                                    <View>
                                        <Text>{item.title}</Text>
                                        <Text>{format(item.startTime, 'hh:mm')} - {format(item.startTime, 'hh:mm')}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No appointments found.</Text>
                            }
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                )}

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: screenWidth,
        maxHeight: 600,
        height: 600,
        backgroundColor: '#f9f9f9',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 36,
        // Apple-style shadow
        // shadowColor: "#4b0082",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 15,
    },
    itemContainer: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    itemText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#111",
    },
    closeButton: {
        backgroundColor: colors.companyMediumPurple,
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: '#7b5dc7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 7,
    },
    backButton: {
        marginBottom: 10,
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    clientName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginTop: 12,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
        marginBottom: 12,
    },
});


export default GalleryModal;