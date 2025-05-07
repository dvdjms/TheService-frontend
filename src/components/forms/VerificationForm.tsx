import React, { useState } from 'react';
import { confirmSignUp } from '@/src/auth/cognito';
import { Text, View, StyleSheet, Button } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const VerificationForm = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const router = useRouter();
    const { email } = useLocalSearchParams();

    // Function to handle email verification
    const handleSubmit = async () => {
      try {

            // const result = await confirmSignUp(email, code)

            // console.log('Verification successful:', result);
            // if (!result.userConfirmed){

                // Navigate to "Enter Code" page, passing the email
                router.push({ pathname: '/verify', params: { email } });
                  
            
            // Redirect to another screen or handle logged-in state here
      } catch (err) {
            console.error('Sign-in failed:', err);
            setError('Failed to verify in. Please check your email.');
      } finally {
            setLoading(false);
      }
    };

    return (
        <>
        <View style={styles.container}>
            <FormField label="Code" value={code} onChangeText={setCode} placeholder="Entry Code" secureTextEntry />

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

export default VerificationForm;