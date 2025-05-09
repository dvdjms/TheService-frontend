import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../src/context/authContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (isLoading) {
    if (!isLoading) {
      router.replace(isAuthenticated ? '(auth)/(signed-in)/(drawer)/(tabs)/home' : '/(auth)/(signed-out)/signin');
    }
  }, [isAuthenticated, isLoading]);

  return null;
}