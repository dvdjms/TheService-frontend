import { useUserDataStore } from "@/src/store/zustand/useUserDataStore";
import { FlatList, TouchableOpacity, Text, StyleSheet, Modal, View } from "react-native"
import { Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { colors } from "@/src/styles/globalStyles";

interface Props {
    visible: boolean;
    onSelect: (client: any) => void;
    onClose: () => void;
}

const screenWidth: number = Dimensions.get("window").width;
const screenHeight: number = Dimensions.get("window").height;

const ClientSelectModal = ({  onSelect, visible, onClose }: Props) => {

    const clients = useUserDataStore(state => state.clients);
    const [showModal, setShowModal] = useState(visible);
    const opacity = useSharedValue(0);
        const translateY = useSharedValue(50);

    useEffect(() => {
        if (visible) {
        setShowModal(true);
        opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
        translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
        } else {
        opacity.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) });
        translateY.value = withTiming(50, { duration: 300, easing: Easing.in(Easing.ease) }, (finished) => {
            if (finished) runOnJS(setShowModal)(false);
        });
        }
    }, [visible]);

    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedModalStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    if (!showModal) return null;


    return (
        <Modal transparent visible={showModal} animationType="none" onRequestClose={onClose}>
            <Animated.View style={[styles.modalBackground, animatedBackgroundStyle]} />
            <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
                    
                {!clients.length ? (
                    <View style={{flex: 1, paddingBottom: 250}}>
                        <Text style={styles.EmptyMessage}>No clients in directory</Text>
                    </View>
                ) : (
                    <FlatList
                    data={clients}
                    keyExtractor={(item) => item.clientId.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onSelect(item)} style={styles.itemContainer}>
                            <Text>{item.firstName} {item.lastName}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    />
                )} 

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </Animated.View>

        </Modal>
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
    closeButtonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    EmptyMessage: {
        textAlign: 'center',
        color: '#999',
        marginTop: 0,
    },
});



export default ClientSelectModal;