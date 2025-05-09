import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { Link } from 'expo-router';
import { useState } from 'react';
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import LoginForm from "@/src/components/forms/SignInForm";

export default function SignInScreen() {

    return (
        <>
        <View style={styles.container}>
            <ScreenTitle title="Login" />
            <LoginForm />
            <Link href="/register">Sign In</Link>
            <Link href="/">home</Link>
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