import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/authContext';
import { RelativePathString, router, usePathname } from 'expo-router';
import type { DrawerScreen } from '@/src/constants/drawerScreens';

type Props = {
    screens: DrawerScreen[];
} & React.ComponentProps<typeof DrawerContentScrollView>;

export default function CustomDrawerContent({ screens, ...props }: Props) {
    const { signOut } = useAuth();
    const pathname = usePathname(); // good for styling e.g.    style={{ backgroundColor: pathname == "/feed" ? "#333" : "#fff" }}

    return (
        <DrawerContentScrollView {...props}>
            {screens.map(({ label, icon, route }) => (
                <DrawerItem
                    key={route}
                    label={label}
                    onPress={() => router.push(route as RelativePathString)}
                    icon={({ size, color }) => (
                        <Ionicons name={icon} size={size} color={color} />
                    )}
                />
            ))}

            <View style={styles.spacer} />

            <DrawerItem
                label="Logout"
                onPress={signOut}
                icon={({ size, color }) => (
                    <Ionicons name="log-out-outline" size={size} color={color} />
                )}
                style={styles.logoutItem}
            />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    spacer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderColor: '#eee',
        marginHorizontal: 10,
        paddingTop: 10,
    },
    logoutItem: {
        backgroundColor: '#ffdd',
    },
});
