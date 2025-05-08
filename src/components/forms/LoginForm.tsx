import React, { useState } from 'react';
import { signIn } from '@/src/auth/authTypes';
import { Text, View, StyleSheet, Button } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';

const LoginForm = () => {
    const { email, setEmail } = useAuth();;
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Function to handle login submission
    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await signIn(email, password);

            console.log('Successfully signed in:', result);
            // Redirect to another screen or handle logged-in state here
            router.push({ pathname: '/', params: { email } });
        } catch (err) {
            console.error('Sign-in failed:', err);
            setError('Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <View style={styles.container}>
            <FormField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
            <FormField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />

            <Button
                title={loading ? 'Signing in...' : 'Sign In'}
                onPress={handleSubmit}
                disabled={loading}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Link href="/register">Register</Link>
        </View>
      </>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0dd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
    },
    textbox: {
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 1,
        height: 30,
        padding: 10,
        width: 200,   
    },
    error: {
        marginTop: 10,
        color: 'red',
      },
});

export default LoginForm;
