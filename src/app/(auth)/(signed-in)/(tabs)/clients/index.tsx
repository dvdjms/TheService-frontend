import { Text, View, StyleSheet } from "react-native";
import { ClientList } from "@/src/components/clients";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from '@/src/styles/globalStyles';

export default function ClientScreen() {
    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <Text style={styles.titleContainer}>Clients</Text>
                <ClientList />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        color: 'red',
        flexDirection: 'row',
        gap: 8,
        fontSize: 22,
    },
});

