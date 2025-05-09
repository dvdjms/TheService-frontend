import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import ScreenTitle from "@/src/components/ui/ScreenTitle";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <ScreenTitle title="'Oops! Not Found' " />

        <Link href="/(signed-in)/(tabs)/home/">
          Go back to Home screen!
        </Link>

        <Link href="/(auth)/signin">
          Sign In
        </Link>
        
      </View>
    </>
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
