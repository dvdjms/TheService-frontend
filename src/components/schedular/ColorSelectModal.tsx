import { apptColours, colors } from "@/src/styles/globalStyles";
import { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Modal, Pressable } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";


interface Props {
    visible: boolean;
    onSelect: (colour: any) => void;
    onClose: () => void;
}


const ColourSelectModal = ({ visible, onSelect, onClose }: Props) => {
    const [showModal, setShowModal] = useState(visible);
    const animatedHeight = useSharedValue(0);
    const [containerHeight, setContainerHeight] = useState(0);


    useEffect(() => {
        if (visible) {
            setShowModal(true);
            animatedHeight.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
        } else {
            animatedHeight.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) }, (finished) => {
                if (finished) {
                    runOnJS (setShowModal)(false);
                }
            });
        }
    }, [visible]);


    const animatedStyle = useAnimatedStyle(() => {
        const translateY = containerHeight * (1 - animatedHeight.value) / 2;
        return {
            transform: [
                { translateY },
                { scaleY: animatedHeight.value },
                { translateY: -translateY },
            ],
            opacity: animatedHeight.value,
        };
    });

    return (
        <>
        {showModal && (
            <Modal transparent visible={showModal} animationType="none" onRequestClose={onClose}>

                <Pressable style={styles.backdrop} onPress={onClose} />

                <Animated.View
                    style={[styles.modalContainer, animatedStyle]}
                    onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
                >
                    {apptColours.map((colour) => (
                    <TouchableOpacity key={colour.value} onPress={() => onSelect(colour.value)}>
                        <View style={styles.itemContainer}>
                        <Text style={styles.text}>{colour.name}</Text>
                        <View style={[styles.colourSquare, { backgroundColor: colour.value }]} />
                        </View>
                    </TouchableOpacity>
                    ))}
                </Animated.View>


            </Modal>
        )}
        </>
    );
};


const styles = StyleSheet.create({
    backdrop: {
        // flex: 1,
        position: 'absolute',
        // backgroundColor: 'rgba(0,0,0,0.2)', // optional dimming
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
        // justifyContent: 'flex-end', // aligns picker to bottom
    },
    modalContainer: {
        position: "absolute",
        backgroundColor: colors.background,
        width: "40%",
        bottom: 100,
        right: 10,
        borderRadius: 20,
        paddingTop: 30,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        // Shadow for Android
        elevation: 10,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
        paddingRight: 20,
    },
    text: {
        height: 50,
    },
    colourSquare: {
        borderWidth: 1,
        borderRadius: 2,
        height: 17,
        width: 17,
    },
});

export default ColourSelectModal;
