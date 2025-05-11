import { Text, View, StyleSheet } from "react-native";
import { Link, Stack } from 'expo-router';

export default function ClientScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.titleContainer} >Clients</Text>
            <Link href="/appointments">Appointments</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0dd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
        gap: 8,
        fontSize: 22,
    },
});

