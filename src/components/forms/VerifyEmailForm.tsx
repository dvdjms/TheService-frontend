import React, { useState } from 'react';
import { verifySignUp } from '@/src/lib/auth/authService';
import { Text, View, StyleSheet, ScrollView } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import FormButton from '../ui/FormButton';
import { colors } from '@/src/styles/globalStyles';


const VerifyEmailForm = () => {
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
        <ScrollView>
            <View style={styles.container}>
                <FormField 
                    autoFocus autoComplete="sms-otp" 
                    label="Enter Code" 
                    value={code} 
                    onChangeText={setCode} 
                    placeholder="Enter Code" 
                    width={0.9} 
                    keyboardType="number-pad" 
                    textContentType="oneTimeCode"
                    iconName={"keypad-outline"}
                    />
                <FormButton OnPress={handleSubmit} title={loading ? 'Verifying...' : 'Verify'} width={0.4} />

                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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

export default VerifyEmailForm;