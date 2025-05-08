// AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { signOut as cognitoSignOut } from '@/src/auth/authService';
import { useRouter } from 'expo-router';

type AuthContextType = {
    email: string;
    setEmail: (email: string) => void;
    firstName: string;
    setFirstName: (name: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    subscriptionTier: 'free' | 'business' | 'premium' | null;
    setSubscriptionTier: (tier: 'free' | 'business' | 'premium') => void;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('Guest');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'business' | 'premium' | null>(null);
    const router = useRouter();


    const signOut = async () => {
        cognitoSignOut();
        setEmail('');
        setFirstName('Guest');
        router.push('/login');
      };

    return (
        <AuthContext.Provider value={{ email, setEmail, firstName, setFirstName, isAuthenticated, setIsAuthenticated, subscriptionTier, setSubscriptionTier, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
