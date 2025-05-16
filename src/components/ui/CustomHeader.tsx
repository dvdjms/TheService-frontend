import HomeIcon from "./HomeIcon";
import { router, useNavigation } from "expo-router";
import CustomHamburgerIcon from "./CustomHamburgerIcon";
import { DrawerActions } from "@react-navigation/native";

export const CustomHeaderRight = () => (
    <HomeIcon onPress={() => router.push('/home')} />
);

export const HamburgerHeaderLeft = () => {
    const navigation = useNavigation();
    return (
        <CustomHamburgerIcon
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
    );
};
