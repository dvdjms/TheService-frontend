import { View, Text, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import SignInForm from "@/src/components/forms/SignInForm";
import DismissKeyboardView from "@/src/components/ui/DismissKeyboardView";
import { colors } from '@/src/styles/globalStyles';

export default function SignInScreen() {

    return (
         <DismissKeyboardView>
            <View style={styles.container}>
                <ScreenTitle title="Sign in" />
                <SignInForm />
                <Link style={styles.link} href="/signup">Sign up</Link>
                <Link style={styles.link} href="/home">home</Link>
            </View>
         </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
    },
    link: {
        marginTop: 20
    },
});