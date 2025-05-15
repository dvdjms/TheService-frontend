import { View, StyleSheet, Pressable } from 'react-native';

export default function CustomHamburgerIcon({ onPress }: { onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.line} />
            <View style={[styles.line, styles.middleLine]} />
            <View style={styles.line} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 7,
        paddingLeft: 15, 
        justifyContent: 'center',
    },
    line: {
        height: 2.3,
        backgroundColor: '#D29F80',
        width: 21,
        marginVertical: 2.3,
        borderRadius: 1,
    },
    middleLine: {
        width: 17,
        alignSelf: 'flex-start',
    },
});
