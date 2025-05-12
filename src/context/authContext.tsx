import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { signIn as cognitoSignIn } from '@/src/lib/auth/cognitoService';
import { signOut as cognitoSignOut } from '../lib/auth/authService';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';

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

interface DecodedIdToken {
    email: string;
    given_name?: string;
    ['custom:subscriptionTier']?: 'free' | 'business' | 'premium';
    [key: string]: any; // optional: allows extra claims without error
}

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
            if (!stored) {
                setIsAuthenticated(false);
                return;
            }

            const { idToken } = JSON.parse(stored);
            const decoded: DecodedIdToken = jwtDecode(idToken);

            // Token expiry check
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now) {
                setIsAuthenticated(false);
                await EncryptedStorage.removeItem('user_session');
                return;
            }

            setEmail(decoded.email);
            setFirstName(decoded.given_name ?? 'Guest');
            setSubscriptionTier(decoded['custom:subscriptionTier'] ?? null);
            setIsAuthenticated(true);
  
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
