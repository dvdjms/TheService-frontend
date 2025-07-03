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


export const subscriptionPlans = [
    {
        id: 'free',
        name: 'Free',
        price: '£0',
        features: [
        'Store images locally',
        'Access core tools',
        'Limited to 100 images',
        ],
    },
    {
        id: 'business',
        name: 'Business',
        price: '£4.99/mo',
        features: [
        'Cloud backup (S3)',
        'Sync across devices',
        'Up to 5,000 images',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '£9.99/mo',
        features: [
        'Unlimited storage',
        'Priority support',
        'Multi-user access',
        ],
    },
];
