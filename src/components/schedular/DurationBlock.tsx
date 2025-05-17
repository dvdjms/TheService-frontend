import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, Text } from 'react-native';

type Unit = 'minutes' | 'hours' | 'days' | 'weeks';

interface Props {
    value: number; 
    unit: Unit;
    maxUnit: number;
}

export default function DurationBlock({ value, unit, maxUnit }: Props) {
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const maxScale = 1;
    const minScale = 0.5;
    const scaleRange = maxScale - minScale;
    const newScale = minScale + ((value - 1) / (maxUnit - 1)) * scaleRange;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                // You could snap the block back or confirm drop
            }
        })
    ).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: newScale,
            useNativeDriver: false,
        }).start();
    }, [value]);

    return (
        <Animated.View
            style={[
                styles.block,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                    ],
                    width: scale.interpolate({
                        inputRange: [minScale, maxScale],
                        outputRange: ['50%', '99%'],
                    }),
                },
            ]}
            {...panResponder.panHandlers}
            >
            <Text style={styles.text}>
                {value} {unit}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    block: {
        backgroundColor: '#4ade80',
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '98%'
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
});
