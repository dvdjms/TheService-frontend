import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import VerificationForm from "@/src/components/forms/VerifyEmailForm";
import DismissKeyboardView from "@/src/components/ui/DismissKeyboardView";
import { colors } from '@/src/styles/globalStyles';


export default function VerifyEmailScreen() {

    const { email } = useLocalSearchParams();

    return (
        <DismissKeyboardView>
            <View style={styles.container}>
                <ScreenTitle title="Verification" />
                <VerificationForm />
                <Link href="/signin">Login</Link>
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
});



