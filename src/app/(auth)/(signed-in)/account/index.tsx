import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { colors } from '@/src/styles/globalStyles';
import { Ionicons } from "@expo/vector-icons";
import ScreenTitle from "@/src/components/ui/ScreenTitle";
import { useAuth } from "@/src/context/authContext";
import { router } from "expo-router";


export default function AccountScreen() {
    const { subscriptionTier } = useAuth();

    return (
        <View style={styles.container}>
            <ScreenTitle title="Account" />

            <View style={styles.linkContainer}>
            <TouchableOpacity style={styles.item} onPress={() => router.push('/(auth)/(signed-in)/account/plan')}>
                <Ionicons name="cube-outline" size={20} style={styles.icon} />
                <Text style={styles.text}>Plans ({subscriptionTier})</Text>
            </TouchableOpacity>

            </View>

        </View>
    );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
        gap: 8,
        fontSize: 22,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    icon: {
        marginRight: 12,
        color: '#333',
    },
    text: {
        fontSize: 18,
    },
    linkContainer: {
        paddingTop: 100,
        paddingLeft: 30,
        width: screenWidth
    }
});
    
