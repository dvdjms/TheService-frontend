import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import RegisterForm from "@/src/components/forms/SignUpForm";
import DismissKeyboardView from "@/src/components/ui/DismissKeyboardView";
import { colors } from '@/src/styles/globalStyles';

export default function SignUpScreen() {

    return (
        <DismissKeyboardView>
            <View style={styles.container}>
                <ScreenTitle title="Register" />
                <RegisterForm />
                <Link style={styles.link}  href="/signin">Login</Link>
            </View>
        </DismissKeyboardView>
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
        flexDirection: 'row',
    },
    link: {
        marginTop: 20
    }
});