// components/HeaderProfileButton.tsx
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/authContext';

export default function HeaderProfileButton() {
  const [showMenu, setShowMenu] = useState(false);
  const { signOut, firstName } = useAuth();

  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
        <Text style={{ fontWeight: 'bold' }}>{firstName ?? 'Guest'} ⌄</Text>
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => {/* navigate to profile screen */}}>
            <Text style={styles.dropdownItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.dropdownItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 25,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 5,
  },
});
