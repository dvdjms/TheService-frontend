import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import SliderBar from './SliderBar';
import DurationBlock from './DurationBlock';

type Unit = 'minutes' | 'hours' | 'days' | 'weeks';

interface Props {
    onChange: (durationMinutes: number) => void;
    defaultUnit?: Unit;
}

const unitLimits: Record<Unit, number> = {
    minutes: 60,
    hours: 24,
    days: 7,
    weeks: 52,
};

// minutes should be 5 minute intervals
// what happens if a user wants 1 week and 2 days
// day view, week view, month view


export default function DurationPicker({ onChange, defaultUnit = 'hours' }: Props) {
    const [value, setValue] = useState(1);
    const [unit, setUnit] = useState<Unit>(defaultUnit);

    useEffect(() => {
        onChange(value * unitLimits[unit]);
    }, [value, unit, onChange]);

    return (
        <View style={{ marginBottom: 20, padding: 15 }}>
            <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Select duration:</Text>

            <SegmentedButtons
                value={unit}
                onValueChange={(v: string) => {
                    setUnit(v as Unit);
                    setValue(1); // reset to 1 for new unit
                }}
                buttons={[
                    { value: 'minutes', label: 'Minutes' },
                    { value: 'hours', label: 'Hours' },
                    { value: 'days', label: 'Days' },
                    { value: 'weeks', label: 'Weeks' },
                ]}
                style={{ marginBottom: 16 }}
            />

            <DurationBlock value={value} unit={unit} maxUnit={unitLimits[unit]} />

            
            <SliderBar 
                value={value} 
                onValueChange={setValue}
                maxTime={unitLimits[unit]}
            />

        </View>
    );
}

