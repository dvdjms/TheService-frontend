import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../../src/components/ui/CustomDrawer';

export default function Layout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        swipeEdgeWidth: 100,
      }}
    >
      {/* Main app content (tabs) */}
      <Drawer.Screen 
        name="(tabs)"
        options={{
          title: 'Main App', // Only shows in drawer menu
          drawerItemStyle: { display: 'none' } // Hide from drawer
        }}
      />
      
      {/* Drawer-specific screens */}
      <Drawer.Screen 
        name="(drawer)/profile"
        options={{ title: 'My Profile' }}
      />
      <Drawer.Screen 
        name="(drawer)/settings"
        options={{ title: 'Settings' }}
      />
    </Drawer>
  );
}
