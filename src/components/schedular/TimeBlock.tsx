// components/TimeBlock.tsx
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export const TimeBlock = ({ hour, selected }: { hour: string, selected?: boolean }) => (
  <View style={[styles.block, selected && styles.selected]}>
    <Text style={styles.text}>{hour}</Text>
  </View>
);

const styles = StyleSheet.create({
  block: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#87ceeb',
  },
  text: {
    fontSize: 16,
  },
});
