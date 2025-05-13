import { router, Stack } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import CustomHamburgerIcon from '@/src/components/ui/CustomHamburgerIcon';
import HomeIcon from '@/src/components/ui/HomeIcon';

export default function SettingsLayout() {
    const navigation = useNavigation();
    return (
        <Stack 
        // screenOptions={{ headerShown:true}}
        >
            {/* <Stack.Screen name="index" options={{ headerShown: true, title: 'Settings' }} /> */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,  
                    title: '',
                    headerLeft: () => (
                        <CustomHamburgerIcon
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        />
                    ),
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />
                    )
                }}
            />
            
            <Stack.Screen 
                name="change-password" 
                options={{ 
                    headerShown: true,  
                    title: '',
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />
                    )
                }} />
        </Stack>
    )
}