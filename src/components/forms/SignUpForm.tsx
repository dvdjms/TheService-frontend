import React, { useState } from 'react';
import { signUp } from '@/src/lib/auth/authService';
import { Text, View, StyleSheet, Button } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';

const SignUpForm = () => {
    const [email, setEmailLocal] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setEmail } = useAuth();

    // Function to handle signUp submission
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
            
            const result = await signUp(email, password, email);
            console.log('Successfully signed in:', result);

            if (!result.userConfirmed){
                setEmail(email);
                // Navigate to "Enter Code" page, passing the email
                router.push({ pathname: '/(auth)/(signed-out)/verify-email', params: { email } }); 
            }
            // Redirect to another screen or handle logged-in state here
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
            <FormField label="Email" value={email} onChangeText={setEmailLocal} placeholder="Enter your email" />
            <FormField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
            <FormField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" secureTextEntry />

            <Button
                title={loading ? 'Registering...' : 'Register'}
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

export default SignUpForm;