import { Redirect, router } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import Drawer from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '@/src/components/ui/CustomDrawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Pressable } from 'react-native';
import HomeIcon from '@/src/components/ui/HomeIcon';

export default function SignedInLayout() {
    const { isAuthenticated } = useAuth();
    const navigation = useNavigation();

    if (!isAuthenticated) return  <Redirect href="/(auth)/(signed-out)/signin" />;


    return (
        <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen 
                name="(tabs)" 
                options={{ 
                    drawerLabel: "Dashboard",
                    title: "",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/profile" 
                options={{ 
                    drawerLabel: "Profile",
                    title: "Profile",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />
                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/settings" 
                options={{ 
                    drawerLabel: "Settings",
                    headerShown: false,
                    title: "Settings",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/help" 
                options={{ 
                    drawerLabel: "Help",
                    title: "Help",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="help-circle-outline" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/about" 
                options={{ 
                    drawerLabel: "About",
                    title: "About",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="information-circle-outline" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />                    )
                }}
            />
        </Drawer>
    )
}