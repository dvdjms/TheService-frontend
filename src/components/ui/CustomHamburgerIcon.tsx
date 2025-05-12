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
        padding: 8,
        justifyContent: 'center',
    },
    line: {
        height: 2,
        backgroundColor: '#3478f7',
        width: 17,
        marginVertical: 1.5,
        borderRadius: 1,
    },
    middleLine: {
        width: 12,
        alignSelf: 'flex-start',
    },
});
