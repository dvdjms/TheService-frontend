import { apptColours } from "@/src/styles/globalStyles";
import { TouchableOpacity, Text, StyleSheet, View, Modal, Pressable } from "react-native"


interface Props {
    visible: boolean;
    onSelect: (colour: any) => void;
    onClose: () => void;
}


const ColourSelectModal = ({  onSelect, visible, onClose }: Props) => {

    return (
        <>

        {visible && (
            <Modal 
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.modalWrapper} />                
                <View style={styles.modalContainer}>
                    {apptColours.map((colour) => (
                        <TouchableOpacity key={colour.value} style={ styles.addColourContainer } onPress={() => onSelect(colour.value)}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.text}>{colour.name}</Text>
                                <View style={[styles.colourSquare, { backgroundColor: colour.value }]} />
                            </View>
                        </TouchableOpacity>
                    ))}

                </View>   

            </Modal>
        )}
        </>
    )
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.1)',
    },
    modalContainer: {
        position: 'absolute',
        backgroundColor: '#ccc',
        width: '40%',
        bottom: 100,
        right: 0,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        paddingTop: 30,
    },
    addColourContainer: {
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 20,
    },
    text: {
        height: 50
    },
    colourSquare: {
        borderWidth: 1,
        borderRadius: 2,
        height: 17,
        width: 17,
    },

})


export default ColourSelectModal;