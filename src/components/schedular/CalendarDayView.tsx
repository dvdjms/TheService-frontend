import React, { useRef, useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface DayCalendarViewProps {
  date: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function DayCalendarView({ date, onSwipeLeft, onSwipeRight }: DayCalendarViewProps) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const listRef = useRef<FlatList>(null);

  const [currentDate, setCurrentDate] = useState(date);
  const [prevDate, setPrevDate] = useState(date);

  const slideIn = useRef(new Animated.Value(0)).current;
  const slideOut = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const directionRef = useRef<'left' | 'right'>('right');

  // Flash & slide animation
  useEffect(() => {
    if (date === currentDate) return;

    const isNext = new Date(date) > new Date(currentDate);
    directionRef.current = isNext ? 'left' : 'right';

    setPrevDate(currentDate);
    setCurrentDate(date);

    // Start positions
    slideIn.setValue(isNext ? screenWidth : -screenWidth);
    slideOut.setValue(0);

    // Flash effect
    Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

        // Animate out old view + in new view
    Animated.parallel([
        Animated.timing(slideIn, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(slideOut, {
            toValue: isNext ? -screenWidth : screenWidth,
            duration: 300,
            useNativeDriver: true,
        }),
        ]).start(() => {
            listRef.current?.scrollToOffset({ offset: 8 * 60, animated: false });
        });
    }, [date]);

    // Swipe gesture
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 30,
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > 50) {
                    onSwipeRight();
                } else if (gestureState.dx < -50) {
                    onSwipeLeft();
                }
            },
        })
    ).current;

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            {/* Outgoing View */}
            <Animated.View
                pointerEvents="none"
                style={[styles.absoluteFill, { transform: [{ translateX: slideOut }] }]}
            >
                <FlatList
                    data={HOURS}
                    keyExtractor={(item) => `prev-${item}`}
                    renderItem={({ item }) => (
                        <View style={styles.hourBlock}>
                            <Text style={{ fontWeight: 'bold' }}>{`${item}:00`}</Text>
                            <Text style={{ fontSize: 6, color: '#aaa' }}>{prevDate}</Text>
                        </View>
                    )}
                />
            </Animated.View>

            {/* Incoming View */}
            <Animated.View
                style={[styles.absoluteFill, { opacity: opacityAnim, transform: [{ translateX: slideIn }] }]}
            >
                <FlatList
                    ref={listRef}
                    data={HOURS}
                    keyExtractor={(item) => `curr-${item}`}
                    renderItem={({ item }) => (
                        <View style={styles.hourBlock}>
                            <Text style={{ fontWeight: 'bold' }}>{`${item}:00`}</Text>
                            <Text style={{ color: '#666' }}>{currentDate}</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    hourBlock: {
        height: 60,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
    },
});
