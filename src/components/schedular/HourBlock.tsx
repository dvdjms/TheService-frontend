import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeBlock } from './TimeBlock';

interface HourBlockProps {
  hour: number;
  date: string;
  selectedHour?: number;
  onPress?: (hour: number) => void;
  isTouchable?: boolean;
}

const HourBlock: React.FC<HourBlockProps> = ({
  hour,
  date,
  selectedHour,
  onPress,
  isTouchable = false,
}) => {
  const content = (
    <>
    <TimeBlock
      onPress={onPress ? () => onPress(hour) : undefined}
      time={`${hour}:00`}
      selected={selectedHour === hour}
      style={isTouchable ? styles.selectedHourBlock : undefined}
    />
      <Text style={{ fontWeight: isTouchable ? 'bold' : 'normal' }}>{`${hour}:00`}</Text>
      <Text style={{ color: isTouchable ? '#666' : '#aaa' }}>{date}</Text>
    </>
  );

  return (
    <View style={styles.hourContainer}>
      {isTouchable ? (
        <TouchableOpacity
          style={[
            styles.hourBlock,
            selectedHour === hour && styles.selectedHourBlock,
          ]}
          onPress={() => onPress?.(hour)}
        >
          {content}
        </TouchableOpacity>
      ) : (
        <View style={styles.hourBlock}>{content}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hourContainer: {
    height: 60,
  },
  hourBlock: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedHourBlock: {
    backgroundColor: '#d0e6ff',
  },
});

export default HourBlock;
