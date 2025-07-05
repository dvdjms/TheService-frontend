import ChangePasswordForm from "@/src/components/forms/ChangePasswordForm";
import { colors } from "@/src/styles/globalStyles";
import { Text, View, StyleSheet } from "react-native";


export default function ChangePasswordScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.titleContainer}>Change Password</Text>
            <ChangePasswordForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        fontSize: 22,
    },
});