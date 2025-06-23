import React, { useState } from 'react';
import { Text, View, StyleSheet } from "react-native";
import FormField from "@/src/components/ui/FormField";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import FormButton from '../ui/FormButton';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '@/src/styles/globalStyles';


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
            // must include at least one uppercase letter
            // must include at least one special character

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
        <ScrollView>
            <View style={styles.container}>
                <FormField 
                    autoFocus autoComplete="email" 
                    label="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    placeholder="Enter your email" 
                    width={0.9} 
                    keyboardType="email-address" 
                    iconName={"mail-outline"}
                    />
                <FormField 
                    autoComplete="password" 
                    label="Password" 
                    value={password} 
                    onChangeText={setPassword} 
                    placeholder="Enter password" 
                    width={0.9} 
                    secureTextEntry
                    onSubmitEditing={handleSubmit} 
                    returnKeyType={"done"}
                    iconName={"lock-closed-outline"}
                    />

                <FormButton OnPress={handleSubmit} title={loading ? 'Signing in...' : 'Sign In'} width={0.9} />
                
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
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

export default SignInForm;
