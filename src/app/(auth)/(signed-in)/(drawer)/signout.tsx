import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/context/authContext";


export default function SignOutScreen() {
    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.titleContainer}>Sign Out</Text>

            <TouchableOpacity style={styles.button} onPress={() => signOut()}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
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
        button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});