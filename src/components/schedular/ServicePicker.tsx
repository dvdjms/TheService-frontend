import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Service } from '@/src/types/Service';

const services: Service[] = [
  { name: 'Cleaning (1 Hour)', durationType: 'hour', durationValue: 1 },
  { name: 'Deep Cleaning (2 Hours)', durationType: 'hour', durationValue: 2 },
  { name: 'Painting (1 Week)', durationType: 'week', durationValue: 1 },
  { name: 'Garden Project (1 Month)', durationType: 'month', durationValue: 1 },
];

interface Props {
  onSelect: (service: Service) => void;
}

const ServicePicker: React.FC<Props> = ({ onSelect }) => {
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Choose a Service:</Text>
      {services.map((s, index) => (
        <TouchableOpacity key={index} onPress={() => onSelect(s)} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16 }}>{s.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ServicePicker;
