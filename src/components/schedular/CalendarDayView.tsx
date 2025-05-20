import React, { useEffect, useRef, useState } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle,
    withTiming,
    runOnJS,
    Easing
} from 'react-native-reanimated';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';


const screenWidth = Dimensions.get('window').width;

interface CalendarDayViewProps {
    currentDate: string;
    isMonthVisible: boolean;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    onSwipeUp: () => void;
    onTap: () => void;
}

export default function CalendarDayView({ currentDate, isMonthVisible, onSwipeLeft, onSwipeRight, onSwipeUp, onTap }: CalendarDayViewProps) {
    const HOURS = Array.from({ length: 24 }, (_, i) => i);
    const listRef = useRef<FlatList>(null);
    const [displayDate, setDisplayDate] = useState(currentDate);
    const [nextDate, setNextDate] = useState('');
    const [prevDate, setPrevDate] = useState('');
    
    const translateX = useSharedValue(0);
    const isSwiping = useSharedValue(false);

    useEffect(() => {
        const date = new Date(currentDate);
        setDisplayDate(currentDate);
        setNextDate(new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0]);
        setPrevDate(new Date(date.setDate(date.getDate() - 2)).toISOString().split('T')[0]);
        listRef.current?.scrollToOffset({ offset: 8 * 60, animated: false });
    }, [currentDate]);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isSwiping.value = true;
        })
        .onUpdate((e) => {
            translateX.value = e.translationX;
        })
        .onEnd((e) => {
            const swipeThreshold = screenWidth * 0.25;
            const velocityThreshold = 500;

        // Swipe right (go to previous day)
        if (e.translationX > swipeThreshold || e.velocityX > velocityThreshold) {
            translateX.value = withTiming(
                screenWidth,
                { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                (finished) => {
                    'worklet';
                    if (finished) {
                        runOnJS(onSwipeRight)();
                        translateX.value = 0;
                        isSwiping.value = false;
                    }
                }
            );
        } 
        // Swipe left (go to next day)
        else if (e.translationX < -swipeThreshold || e.velocityX < -velocityThreshold) {
            translateX.value = withTiming(
            -screenWidth,
            { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
            (finished) => {
                'worklet';
                if (finished) {
                    runOnJS(onSwipeLeft)();
                    translateX.value = 0;
                    isSwiping.value = false;
                }
            }
            );
        }
        else {
            translateX.value = withTiming(0, { duration: 200 });
            isSwiping.value = false;
        }
    });

    const tapGesture = Gesture.Tap()
        .enabled(isMonthVisible)
        .onEnd(() => {
            runOnJS(onTap)();
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const nextDayStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value + screenWidth }],
        };
    });

    const prevDayStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value - screenWidth }],
        };
    });

    return (
        <GestureDetector gesture={Gesture.Simultaneous(panGesture, tapGesture)}>
            <View style={{ flex: 1, overflow: 'hidden' }}>
                {/* Previous Day (left) */}
                <Animated.View style={[StyleSheet.absoluteFill, prevDayStyle]}>
                    <FlatList
                        ref={listRef}
                        data={HOURS}
                        keyExtractor={(item) => `prev-${item}`}
                        renderItem={({ item }) => (
                        <View style={styles.hourBlock}>
                            <Text>{`${item}:00`}</Text>
                            <Text style={{ color: '#aaa' }}>{prevDate}</Text>
                        </View>
                        )}
                    />
                </Animated.View>

                {/* Current Day (center) */}
                <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                    <FlatList
                        ref={listRef}
                        data={HOURS}
                        keyExtractor={(item) => `curr-${item}`}
                        renderItem={({ item }) => (
                        <View style={styles.hourBlock}>
                            <Text>{`${item}:00`}</Text>
                            <Text style={{ color: '#666' }}>{displayDate}</Text>
                        </View>
                        )}
                    />
                </Animated.View>

                {/* Next Day (right) */}
                <Animated.View style={[StyleSheet.absoluteFill, nextDayStyle]}>
                    <FlatList
                        ref={listRef}
                        data={HOURS}
                        keyExtractor={(item) => `next-${item}`}
                        renderItem={({ item }) => (
                        <View style={styles.hourBlock}>
                            <Text>{`${item}:00`}</Text>
                            <Text style={{ color: '#aaa' }}>{nextDate}</Text>
                        </View>
                        )}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
}


const styles = StyleSheet.create({
    hourBlock: {
        height: 60,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
    },
    dateHeader: {
        fontSize: 18,
        textAlign: 'center',
        padding: 12,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderColor: '#ccc',
},
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        flex: 1,
    },
    arrow: {
        padding: 12,
    },
    arrowText: {
        fontSize: 20,
    },
});
