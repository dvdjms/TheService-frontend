// src/app/(drawer)/_layout.tsx
import { Redirect } from 'expo-router';
import Drawer from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/authContext';
import CustomDrawerContent from '@/src/components/ui/CustomDrawer';
import { drawerScreens } from '@/src/constants/drawerScreens';

export default function SignedInLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/(signed-out)/signin" />;
    }

  return (
        <Drawer screenOptions={{ headerTitle: "" }} drawerContent={(props) => <CustomDrawerContent children={undefined} {...props} screens={drawerScreens} />}>
        {drawerScreens.map(({ name, label, icon }) => (
            <Drawer.Screen
                key={name}
                name={name}
                options={{
                    drawerLabel: label,
                    drawerIcon: ({ size, color }) => (
                    <Ionicons name={icon} size={size} color={color} />
                    ),
                }}
            />
        ))}
        </Drawer>
    );
}
