import { Redirect } from 'expo-router';
import Drawer from 'expo-router/drawer';
import { useAuth } from '@/src/context/authContext';
import CustomDrawerContent from '@/src/components/ui/CustomDrawer';
import { drawerScreens } from '@/src/constants/drawerScreens';
import { CustomHeaderRight, HamburgerHeaderLeft } from '@/src/components/ui/CustomHeader';
import { colors } from '@/src/styles/globalStyles';

export default function SignedInLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/(signed-out)/signin" />;
    }

  return (
        <Drawer 
            drawerContent={(props) => <CustomDrawerContent {...props} 
                children={undefined} screens={drawerScreens} />
            } 
            screenOptions={{ headerShown: false, drawerType: 'slide' }}>

            {drawerScreens.map(({ name, label, icon }) => (
                <Drawer.Screen
                    key={name}
                    name={name}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: colors.backgroundHeaderFooter
                        },
                        drawerLabel: label,
                        headerLeft: () => (
                            <HamburgerHeaderLeft />
                        ),
                         ...(name !== '(tabs)' && {
                            headerRight: () => <CustomHeaderRight />
                            
                        }),
                        headerTintColor: name === '(tabs)' ? 'red' : 'pink', // Title color
                        headerTitleStyle: {
                            fontWeight: '600',
                        }
                    }}
                />
            ))}
        </Drawer>
    );
}
