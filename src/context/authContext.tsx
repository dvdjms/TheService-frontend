import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { signIn as cognitoSignIn } from '@/src/lib/auth/cognitoService';
import { signOut as cognitoSignOut } from '../lib/auth/authService';
import { router } from 'expo-router';

type AuthContextType = {
    email: string;
    setEmail: (email: string) => void;
    firstName: string;
    setFirstName: (name: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    subscriptionTier: 'free' | 'business' | 'premium' | null;
    setSubscriptionTier: (tier: 'free' | 'business' | 'premium') => void;
    signIn: (name: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
    hasCheckedAuth: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('Guest');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'business' | 'premium' | null>(null);
    const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

    useEffect(() => {
        init();
    }, []); 

    const init = async () => {
        checkAuth();
    };

    const checkAuth = async () => {
        try{
            const stored = await EncryptedStorage.getItem('user_session');
            const isAuth = !!stored;
            setIsAuthenticated(isAuth)

        } catch(error){
            setIsAuthenticated(false);
        } finally {
            setHasCheckedAuth(true);
            setIsLoading(false);
        }
    };


    const signIn = async (username: string, password: string) => {
        setIsLoading(true)
        try{
            await cognitoSignIn(username, password);
            await checkAuth();
        }catch(error){
            console.log(error)
            throw error;
        }finally {
            setIsLoading(false)
        }
    };


    const signOut = async () => {
        await EncryptedStorage.removeItem('user_session');
        cognitoSignOut();
        setEmail('');
        setFirstName('Guest');
        setIsAuthenticated(false);
        router.replace('/signin');
    };


    const parseJwt = (token: string) => {
        try {
            const base64Payload = token.split('.')[1];
            if (!base64Payload) return {};
            const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
            return JSON.parse(payload);
        } catch (e) {
            console.error('Failed to parse JWT:', e);
            return {};
        }
    };

    return (
        <AuthContext.Provider
            value={{
                email,
                setEmail,
                firstName,
                setFirstName,
                isAuthenticated,
                setIsAuthenticated,
                subscriptionTier,
                setSubscriptionTier,
                signOut,
                signIn,
                isLoading,
                hasCheckedAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
