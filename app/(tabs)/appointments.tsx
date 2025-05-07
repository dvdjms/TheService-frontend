import { Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";

export default function AppointmentScreen() {
  return (
    <View style={styles.container}>
        <ScreenTitle title="Appointments" />

        <Link href="/clients">Clients</Link>
        <Link href="/login">Login</Link>
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