import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tabScreens } from '../../../../constants/tabScreens';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
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
