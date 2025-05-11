import React, { useState } from 'react';
import { verifySignUp } from '@/src/lib/auth/authService';
import { Text, View, StyleSheet, Button } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';

const VerifySignUpForm = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const router = useRouter();
    const { email } = useAuth();

    // Function to handle email verification
    const handleSubmit = async () => {
        try {
            // const email = searchParams.email as string;
            console.log('email:', email, 'code', code)
            const result = await verifySignUp(email, code)

            console.log('Verification successful:', result);
            // if (!result.UserConfirmed){
            //     setError("Invalid Code. Please check email")
            // }

            // Redirect to another screen or handle logged-in state here
            router.push({ pathname: '/(auth)/(signed-in)/(tabs)/home', params: { email } });
                  
        } catch (err) {
            console.error('Sign-in failed:', err);
            setError('Failed to verify. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <View style={styles.container}>
            <FormField label="Enter Code" value={code} onChangeText={setCode} placeholder="Enter Code" secureTextEntry />

            <Button
                title={loading ? 'Verifying...' : 'Verify'}
                onPress={handleSubmit}
                disabled={loading}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
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

export default VerifySignUpForm;