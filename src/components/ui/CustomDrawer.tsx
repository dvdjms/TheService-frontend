// src/components/ui/CustomDrawer.tsx
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/authContext';
import { router } from 'expo-router';
import type { DrawerScreen } from '@/src/constants/drawerScreens';

type Props = {
  screens: DrawerScreen[];
} & React.ComponentProps<typeof DrawerContentScrollView>;

export default function CustomDrawerContent({ screens, ...props }: Props) {
  const { signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      {screens.map(({ label, icon, route }) => (
        <DrawerItem
          key={route}
          label={label}
          onPress={() => router.push(route as any)}
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



// import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { View, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '@/src/context/authContext';
// import { router } from 'expo-router';


// export default function CustomDrawerContent(props: DrawerContentComponentProps) {
//     const { signOut } = useAuth();

//     return (
//         <DrawerContentScrollView>
        
//             <DrawerItem
//                 label="Dashboard"
//                 onPress={() => router.push('/home')}
//                 icon={({ size, color }) => (
//                     <Ionicons name="home-outline" size={size} color={color} />
//                 )}
//             />

//             <DrawerItem
//                 label="Profile"
//                 onPress={() => router.push('/profile')}
//                 icon={({ size, color }) => (
//                     <Ionicons name="person-outline" size={size} color={color} />
//                 )}
//             />

//             <DrawerItem
//                 label="Settings"
//                 onPress={() => router.push('/settings')}
//                 icon={({ size, color }) => (
//                     <Ionicons name="settings-outline" size={size} color={color} />
//                 )}
//             />

//             <DrawerItem
//                 label="Help"
//                 onPress={() => router.push('/help')}
//                 icon={({ size, color }) => (
//                     <Ionicons name="help-circle-outline" size={size} color={color} />
//                 )}
//             />

//             <DrawerItem
//                 label="About"
//                 onPress={() => router.push('/about')}
//                 icon={({ size, color }) => (
//                     <Ionicons name="information-circle-outline" size={size} color={color} />
//                 )}
//             />

//             <View style={styles.spacer} />

//             <DrawerItem
//                 label="Logout"
//                 onPress={signOut}
//                 icon={({ size, color }) => (
//                     <Ionicons name="log-out-outline" size={size} color={color} />
//                 )}
//                 style={styles.logoutItem}
//             />
//         </DrawerContentScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     spacer: {
//         marginTop: 30,
//         borderTopWidth: 1,
//         borderColor: '#eee',
//         marginHorizontal: 10,
//         paddingTop: 10,
//     },
//     logoutItem: {
//         backgroundColor: '#ffdd',
//     },
// });
