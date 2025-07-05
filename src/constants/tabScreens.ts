import { Ionicons } from '@expo/vector-icons';

type TabScreen = {
    name: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
};

// tabs screen items
export const tabScreens: TabScreen[] = [
    { name: 'home', title: 'Dashboard', icon: 'home-outline' },
    { name: 'schedular/index', title: 'Schedular', icon: 'calendar-outline' },
    { name: 'clients', title: 'Clients', icon: 'people-outline' },
    { name: 'camera/index', title: 'Camera', icon: 'camera-outline' },
    { name: 'gallery/index', title: 'Gallery', icon: 'image-outline' },
];
