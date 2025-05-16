import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { colors } from '@/src/styles/globalStyles';

export const headerConfig: BottomTabNavigationOptions  = {
    headerStyle: {
        backgroundColor: colors.backgroundHeaderFooter
    },
    headerTintColor: '#fff', // Text/icon color
    headerTitleStyle: {
        fontWeight: '600',
    }
};