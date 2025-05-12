import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/authContext';


export default function CustomDrawerContent(props: any) {
    const { signOut } = useAuth();

    return (
        <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        
        <View style={styles.spacer} />

        <DrawerItem
            label="Logout"
            onPress={() => signOut()}
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
        marginTop: 30, // Adjust for desired spacing
        borderTopWidth: 1,
        borderColor: '#eee',
        marginHorizontal: 10,
        paddingTop: 10,
    },
    logoutItem: {
        backgroundColor: '#ffdd'
    
    },
});
