import React, { useState } from 'react';
import { signUp } from '@/src/lib/auth/authService';
import { Text, View, StyleSheet } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import FormButton from '../ui/FormButton';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '@/src/styles/globalStyles';

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { email, setEmail} = useAuth();

    // Function to handle signUp submission
    const handleSubmit = async () => {
      setLoading(true);
        setError('');

        try {
        
            if (newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }
            
            const result = await signUp(email, newPassword, email);
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
        <ScrollView>
            <View style={styles.container}>
                <FormField label="Old password" value={oldPassword} onChangeText={setOldPassword} placeholder="Enter old password" width={0.9} secureTextEntry />
                <FormField label="New password" value={newPassword} onChangeText={setNewPassword} placeholder="Enter new password" width={0.9} secureTextEntry />
                <FormField label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} width={0.9} placeholder="Confirm new password" secureTextEntry />

                <FormButton title={loading ? 'Confirming...' : 'Confirm'} OnPress={handleSubmit} width={0.9} />

                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </ScrollView>
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

export default ChangePasswordForm;