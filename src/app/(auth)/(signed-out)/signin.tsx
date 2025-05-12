import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import SignInForm from "@/src/components/forms/SignInForm";


export default function SignInScreen() {

    return (
        <>
        <View style={styles.container}>
            <ScreenTitle title="Login" />
            <SignInForm />
            <Link href="/signup">Sign up</Link>
            <Link href="/home">home</Link>
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