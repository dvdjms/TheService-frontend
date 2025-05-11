import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/authContext';
import Drawer from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function SignedInLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return  <Redirect href="/(auth)/(signed-out)/signin" />;


    return (
        <Drawer>
            <Drawer.Screen 
                name="(tabs)" 
                options={{ 
                    drawerLabel: "Home",
                    title: "",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                )}}
            />
            <Drawer.Screen 
                name="(drawer)/profile" 
                options={{ 
                    drawerLabel: "Profile",
                    title: "Profile",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/settings" 
                options={{ 
                    drawerLabel: "Settings",
                    title: "Settings",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/help" 
                options={{ 
                    drawerLabel: "Help",
                    title: "Help",
                    drawerIcon: ({ size, color }) => (
                            <Ionicons name="help-outline" size={size} color={color} />
                    )
                }}
            />
            <Drawer.Screen 
                name="(drawer)/signout" 
                options={{ 
                    drawerLabel: "Logout",
                    title: "Logout",
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="log-out-outline" size={size} color={color} />
                    )
                }}
            />
        </Drawer>
    )
}