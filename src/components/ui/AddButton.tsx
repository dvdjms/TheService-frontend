import { Text, StyleSheet, TouchableOpacity, SafeAreaView, View, ViewStyle } from 'react-native';

interface Props {
    onPress: () => void;
    style?: ViewStyle;
};


export const AddButton = ({ onPress, style }: Props ) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#8A63D2',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        opacity: .8
    },
    plus: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '600',
        lineHeight: 34,
    },
});



