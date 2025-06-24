import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import EncryptedStorage from 'react-native-encrypted-storage';
import * as SecureStore from 'expo-secure-store';

import { 
    signIn as cognitoSignIn, 
    signOut as cognitoSignOut,
    extractTokens,
    getUserSession,
    refreshSession,
 } from '@/src/lib/auth/cognitoService';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
    userId: string;
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
    accessToken: string | null;
};

interface DecodedIdToken {
    userId: string;
    email: string;
    given_name?: string;
    ['custom:subscriptionTier']?: 'free' | 'business' | 'premium';
    [key: string]: any; // optional: allows extra claims without error
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('Guest');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'business' | 'premium' | null>(null);
    const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        init();
    }, []); 

    const init = async () => {
        checkAuth();
    };

    const checkAuth = async () => {
        try{
            const isAvailable = await SecureStore.isAvailableAsync();

            if (!isAvailable) {
                alert('SecureStore is not available on this device');
                setIsAuthenticated(false);
                return;
            }
            const { idToken, accessToken, refreshToken } = await getUserSession();

            if (!idToken) {
                setIsAuthenticated(false);
                return;
            }

            const decoded: DecodedIdToken = jwtDecode(idToken);
            const now = Math.floor(Date.now() / 1000);
            
            //If token is expiry, try to refresh - during development so I don't repeat signin
            // if (decoded.exp < now && refreshToken) {
            //     const refreshedSession = await refreshSession(refreshToken);
            //     if(!refreshedSession) {
            //         // await EncryptedStorage.removeItem('accessToken');
            //         await SecureStore.deleteItemAsync('user_session');
            //         setIsAuthenticated(false);
            //         return;
            //     }
            // }

            // Refresh token if expired or about to expire within 5 minutes
            if (decoded.exp < now + 300 && refreshToken) {
                const refreshedSession = await refreshSession(refreshToken);
                if (!refreshedSession) {
                    // Clear stored tokens on failed refresh

                    await SecureStore.deleteItemAsync('id_token');
                    await SecureStore.deleteItemAsync('access_token');
                    await SecureStore.deleteItemAsync('refresh_token');
                    setIsAuthenticated(false);
                    return;
                }
                
                // Save refreshed tokens
                const { idToken: newIdToken, accessToken: newAccessToken, refreshToken: newRefreshToken } = extractTokens(refreshedSession);
                await SecureStore.setItemAsync('id_token', newIdToken);
                await SecureStore.setItemAsync('access_token', newAccessToken);
                await SecureStore.setItemAsync('refresh_token', newRefreshToken);

                // Update decoded token and userId for fresh session
                const newDecoded: DecodedIdToken = jwtDecode(newIdToken);
                setUserId(newDecoded.sub);
                setEmail(newDecoded.email);
                setFirstName(newDecoded.given_name ?? 'Guest');
                setSubscriptionTier(newDecoded['custom:subscriptionTier'] ?? null);
                setIsAuthenticated(true);
                setAccessToken(newAccessToken);
                return;
            }

            setUserId(decoded.sub);
            setEmail(decoded.email);
            setFirstName(decoded.given_name ?? 'Guest');
            setSubscriptionTier(decoded['custom:subscriptionTier'] ?? null);
            setIsAuthenticated(true);
            setAccessToken(accessToken);
  
        } catch(error){
            console.error('checkAuth error:', error);
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
        await SecureStore.deleteItemAsync('id_token');
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        cognitoSignOut();
        setUserId('');
        setEmail('');
        setFirstName('Guest');
        setIsAuthenticated(false);
        router.replace('/signin');
    };


    return (
        <AuthContext.Provider
            value={{
                userId,
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
                hasCheckedAuth,
                accessToken
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
