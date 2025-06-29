import { Ionicons } from '@expo/vector-icons';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
    onPress: () => void;
    name: keyof typeof Ionicons.glyphMap;
    value: string;
    title: string
};


export const CustomContact = ({ name, value, title }: Props) => {

    return (
        <TouchableOpacity>
            <View style={styles.container}>
                <Ionicons name={name} size={22} value={value}></Ionicons>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        width: 100,
        gap: 5
    },
    title: {
        paddingTop: 7,
        fontSize: 14
    }
});