import { Ionicons } from '@expo/vector-icons';

type TabScreen = {
    name: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
};

// tabs screen items
export const tabScreens: TabScreen[] = [
    { name: 'home', title: 'Dashboard', icon: 'home-outline' },
    { name: 'appointments/index', title: 'Appointments', icon: 'calendar-outline' },
    { name: 'clients', title: 'Clients', icon: 'people-outline' },
    { name: 'more/index', title: 'More', icon: 'ellipsis-horizontal' },
];
