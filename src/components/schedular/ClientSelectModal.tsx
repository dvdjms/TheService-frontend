import { useClientStore } from "@/src/store/clientStore";
import { FlatList, TouchableOpacity, Text, StyleSheet, View, Modal } from "react-native"
import FormButton from "../ui/FormButton";
import { Dimensions } from "react-native";

interface Props {
    visible: boolean;
    onSelect: (client: any) => void;
    onClose: () => void;
}


const screenWidth: number = Dimensions.get("window").width;

const ClientSelectModal = ({  onSelect, visible, onClose }: Props) => {

    const clients = useClientStore(state => state.clients);

    return (
        <>
        {visible && (
            <Modal 
                visible={visible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.modalBackground}>
                <View style={styles.flatListContainer}>
                    <FlatList
                        data={clients}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onSelect(item)}>
                                <View style={styles.itemContainer}>
                                    <Text>{item.firstName} {item.lastName}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <FormButton title={"Close"} OnPress={onClose} width={0.5}></FormButton>
                </View>
                </View>
       
            </Modal>
        )}
        </>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        flex: 1,
        position: 'absolute',
        padding: 50,
        backgroundColor: 'gray',
        height: 800,
        width: screenWidth,
        bottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        backgroundColor: 'lightyellow',
        height: 50,
        borderRadius: 5,
        marginBottom: 3,
        justifyContent: 'center'
    }
})


export default ClientSelectModal;