import { Ionicons } from '@expo/vector-icons';

export type DrawerScreen = {
    name: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
};

// drawer menu items
export const drawerScreens: DrawerScreen[] = [
    { name: "dashboard", label: "Dashboard", icon: "home-outline", route: "/(signed-in)/dashboard" },
    { name: "account", label: "Account", icon: "person-outline", route: "/(signed-in)/account" },
    { name: "settings", label: "Settings", icon: "settings-outline", route: "/(signed-in)/settings" },
    { name: "help", label: "Help", icon: "help-circle-outline", route: "/(signed-in)/help" },
    { name: "about", label: "About", icon: "information-circle-outline", route: "/(signed-in)/about" }
];
