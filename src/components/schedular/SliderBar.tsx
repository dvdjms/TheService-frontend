import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface Props {
  value: number;
  onValueChange: (val: number) => void;
  maxTime: number;
}

export default function SliderBar({ value, onValueChange, maxTime }: Props) {
    return (
        <View style={styles.sliderWrapper}>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={maxTime}
                value={value}
                onValueChange={onValueChange}
                step={1}
                minimumTrackTintColor="#4ade80"
                maximumTrackTintColor="#d1d5db"
                thumbTintColor="#16a34a"
            />
        </View>

    );
}

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: '#ecfdf5',  // Light green background
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 5,
    // shadowColor: '#34d399',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.3,
    // shadowRadius: 10,
    elevation: 8,  // For Android shadow
  },
  slider: {
    height: 40,
  },
});
