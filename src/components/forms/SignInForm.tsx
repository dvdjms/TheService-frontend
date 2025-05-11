import React, { useState } from 'react';
import { Text, View, StyleSheet, Button } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';


const SignInForm = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
   

    // Function to handle login submission
    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            if (!email || !password) {
                throw new Error('All fields are required');
            }
        
            if (!email.includes('@')) {
                throw new Error('Username must be a valid email address');
            }
        
            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }

            await signIn(email, password);

            router.push({ pathname: '/(auth)/(signed-in)/(tabs)/home', params: { email } });
            
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
            <Link href="/signup">Register</Link>
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

export default SignInForm;
