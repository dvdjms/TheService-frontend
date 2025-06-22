import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    onPress: () => void;
};


export const AddButton = ({ onPress }: Props) => {

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}><Text style={styles.plus}>+</Text></TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 20,
        top: 10,
        backgroundColor:'#4CAF50', /* Green background */
        opacity: 0.7,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
    },
    plus: {
        fontSize: 28,
        color: 'white',
        lineHeight: 28,
        marginTop: 2
    }
});
