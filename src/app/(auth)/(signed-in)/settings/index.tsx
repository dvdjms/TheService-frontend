import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';

export default function SettingScreen() {
    return (

        <View style={styles.container}>
            <Text style={styles.titleContainer} >Settings</Text>

            <Link href="/settings/change-password" asChild>
                <TouchableOpacity style={styles.item}>
                <Text style={styles.text}>Change Password</Text>
                </TouchableOpacity>
            </Link>

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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    icon: {
        marginRight: 12,
        color: '#333',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});