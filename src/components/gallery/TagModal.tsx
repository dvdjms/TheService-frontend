import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { colors } from '@/src/styles/globalStyles';

interface TagModalProps {
    photoUri: string | null;
    onClose: () => void;
}

export default function TagModal({ photoUri, onClose }: TagModalProps) {
  const [client, setClient] = useState('');
  const [appointment, setAppointment] = useState('');

  function saveTags() {
    // Save tags logic (e.g., update local DB or state, then close modal)
    onClose();
  }

  return (
        <View style={styles.container}>
            <Text style={styles.title}>Tag Photo</Text>
            {/* You can add the photo preview here with <Image source={{uri: photoUri}} /> */}

            <TextInput
                placeholder="Client name"
                value={client}
                onChangeText={setClient}
                style={styles.input}
            />

            <TextInput
                placeholder="Appointment"
                value={appointment}
                onChangeText={setAppointment}
                style={styles.input}
            />

            <Button title="Save Tags" onPress={saveTags} />
            <Button title="Cancel" onPress={onClose} color="red" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: 'pink'
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: 'pink',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});
