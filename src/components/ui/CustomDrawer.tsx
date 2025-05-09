import { signOut } from '@/src/auth/authService';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent() {
  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="My Profile"
        onPress={() => router.push('/(auth)/(signed-in)/(drawer)/profile')}
      />
      
      <DrawerItem
        label="Settings"
        onPress={() => router.push('/(auth)/(signed-in)/(drawer)/settings')}
      />
        <DrawerItem
        label="Help"
        onPress={() => router.push('/(auth)/(signed-in)/(drawer)/settings')}
      />
    <DrawerItem
        label="Home"
        onPress={() => router.push('/(auth)/(signed-in)/(tabs)/home')}
      />
      <DrawerItem
        label="Sign Out"
        onPress={() => signOut()}
      />


    </DrawerContentScrollView>
  );
}