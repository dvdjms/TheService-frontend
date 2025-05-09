import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import VerificationForm from "@/src/components/forms/VerifySignUpForm";


export default function VerifySignUpScreen() {

    const { email } = useLocalSearchParams();

    return (
        <>
        <View style={styles.container}>
            <ScreenTitle title="Verification" />
            <VerificationForm />
            <Link href="/login">Login</Link>
        </View>
      </>
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
    },
});



