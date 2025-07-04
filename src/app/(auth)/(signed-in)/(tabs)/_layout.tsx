import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tabScreens } from '../../../../constants/tabScreens';
import { CustomHeaderRight, HamburgerHeaderLeft } from '@/src/components/ui/CustomHeader';
import { headerConfig } from '@/src/components/utils/navigationTheme';
import { colors } from '@/src/styles/globalStyles';

export default function TabLayout() {

    return (
        <Tabs screenOptions={( { route }) => ({ 
            ...headerConfig,
            headerShown: true,
            headerTitle: "",
            headerLeft: () => (
                <HamburgerHeaderLeft />
            ),
            headerRight: () => (
                route.name === '(tabs)' ? <CustomHeaderRight /> : null
            ),
            tabBarStyle: colors.tabBarStyle,
            headerStyle: colors.headerStyle,
            tabBarActiveTintColor: colors.iconActive,
            tabBarInactiveTintColor: colors.iconInactive,

            ////////////////// Confused by the not equals to tabs
            headerTintColor: route.name !== '(tabs)' ? 'gray' : 'pink', // Title color
 

        })}>
            {tabScreens.map(({ name, title, icon }) => (
                <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                        title,
                        tabBarIcon: ({ color }) => (
                            <Ionicons name={icon} size={28} color={color} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}
