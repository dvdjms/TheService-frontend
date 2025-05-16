import { Text, View, StyleSheet } from "react-native";
import { colors } from '@/src/styles/globalStyles';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleContainer}>Help</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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