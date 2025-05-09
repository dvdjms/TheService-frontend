import { Text, View, StyleSheet } from "react-native";


export default function SignOutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleContainer}>Sign Out</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0dd',
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