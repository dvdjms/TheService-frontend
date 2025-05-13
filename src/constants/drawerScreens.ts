// src/constants/drawerScreens.ts
import { Ionicons } from '@expo/vector-icons';

export type DrawerScreen = {
    name: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
};

export const drawerScreens: DrawerScreen[] = [
    { name: "(tabs)", label: "Dashboard", icon: "home-outline", route: "/home" },
    { name: "profile", label: "Profile", icon: "person-outline", route: "/profile" },
    { name: "settings", label: "Settings", icon: "settings-outline", route: "/settings" },
    { name: "help", label: "Help", icon: "help-circle-outline", route: "/help" },
    { name: "about", label: "About", icon: "information-circle-outline", route: "/about" },
];
