import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { Link } from 'expo-router';
import { useState } from 'react';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import RegisterForm from "@/src/components/forms/SignUpForm";

export default function SignUpScreen() {

    return (
        <>
        <View style={styles.container}>
            <ScreenTitle title="Register" />
            <RegisterForm />
            <Link href="/signin">Login</Link>
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