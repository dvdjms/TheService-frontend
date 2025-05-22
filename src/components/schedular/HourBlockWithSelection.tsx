// HourBlockWithSelection.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HourBlock } from './HourBlock';

interface HourBlockWithSelectionProps {
  hour: number;
  date: string;
  isSelected: boolean;
  isInSelectionRange: boolean;
  onPressIn: (hour: number) => void;
  onPressOut: () => void;
}

export const HourBlockWithSelection = React.memo(({ 
  hour,
  date,
  isSelected,
  isInSelectionRange,
  onPressIn,
  onPressOut
}: HourBlockWithSelectionProps) => {
  return (
    <View 
      style={[styles.container, isInSelectionRange && styles.rangeSelection]}
      onTouchStart={() => onPressIn(hour)}
      onTouchEnd={onPressOut}
    >
      <HourBlock 
        hour={hour} 
        date={date} 
        isSelected={isSelected} 
        onPress={() => {}} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rangeSelection: {
    backgroundColor: '#e3f2fd',
  },
});