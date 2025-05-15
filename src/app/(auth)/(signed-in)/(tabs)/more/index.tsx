import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.header}>More</Text>

      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="person-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(auth)/(signed-in)/settings" asChild>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="settings-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Settings</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/help" asChild>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="help-circle-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>
      </Link>

        <Link href="/profile" asChild>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="log-out-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
      </Link>
    </View>
    </>
  );
}


    // container: {
    //     flex: 1,
    //     backgroundColor: '#f0f0dd',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // titleContainer: {
    //     color: 'red',
    //     flexDirection: 'row',
    //     gap: 8,
    //     fontSize: 22,
    // },


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
    color: '#333',
  },
});

