import { DrawerToggleButton } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { View } from "react-native";


export default function DrawerLayout() {
    return (
        <Drawer

      screenOptions={{
        headerTitle: () => null,
        headerLeft: () => (
          <View style={{ marginLeft: 15 }}>
            <DrawerToggleButton />
          </View>
        ),
        headerTitleContainerStyle: { display: 'none' },
        headerStyle: { 
          shadowOpacity: 0, // Removes shadow
          elevation: 0 // Android
        }
      }}
    >

            {/* These are your route groups - they won't appear in drawer */}
            {/* <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} /> */}
            {/* <Drawer.Screen name="(drawer)" options={{ title: 'More' }} /> */}
        </Drawer>
        
    );
}

