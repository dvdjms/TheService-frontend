import { View, StyleSheet, TextInput, Button } from "react-native";
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

import ScreenTitle from "@/src/components/ui/ScreenTitle";
import RegisterForm from "@/src/components/forms/RegisterForm";
import FormField from "@/src/components/ui/FormField";

export default function VerifyScreen() {

    const { email } = useLocalSearchParams();



    return (
        <>
        <View style={styles.container}>
            <ScreenTitle title="Verifiation" />

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



