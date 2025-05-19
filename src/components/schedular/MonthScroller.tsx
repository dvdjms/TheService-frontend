import React, { useEffect, useRef, useState, useMemo } from 'react';
import { addMonths, format, isSameMonth, startOfMonth } from 'date-fns';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  View,
} from 'react-native';

type MonthScrollerProps = {
    currentMonth: Date;
    onMonthPress: (newDate: Date) => void;
};

export default function MonthScroller({ currentMonth, onMonthPress}: MonthScrollerProps) {
    const scrollRef = useRef<ScrollView>(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [buttonOffsets, setButtonOffsets] = useState<Record<number, number>>({});

    const monthItems = useMemo(() =>
        Array.from({ length: 36 }, (_, i) =>
            addMonths(startOfMonth(new Date()), i - 12, )
        ),
    []);

    useEffect(() => {
        if (!hasScrolled) {
        const index = monthItems.findIndex((date) => isSameMonth(date, currentMonth));
        if (index !== -1 && buttonOffsets[index] !== undefined && scrollRef.current) {
            scrollRef.current.scrollTo({ x: buttonOffsets[index], animated: false });
            setHasScrolled(true);
        }
        }
    }, [buttonOffsets, hasScrolled, currentMonth]);
  
    const handleLayout = (index: number) => (event: LayoutChangeEvent) => {
        const { x } = event.nativeEvent.layout;
        setButtonOffsets((prev) => ({ ...prev, [index]: x }));
    };


    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            >
            {monthItems.map((date, index) => {
                const isSelected = isSameMonth(date, currentMonth);
                const isJanuary = format(date, 'MMM') === 'Jan';
                const showYear = isJanuary || index === 0 ||
                format(monthItems[index - 1], 'yyyy') !== format(date, 'yyyy');

                return (
                    <View key={index} onLayout={handleLayout(index)} style={styles.monthScrollBar}>
                        {showYear && (
                            <Text style={styles.yearLabel}>{format(date, 'yyyy')}</Text>
                        )}
                        <TouchableOpacity
                            onPress={() => onMonthPress(date)}
                            style={[styles.monthButton, isSelected && styles.selectedMonthButton]}
                        >
                            <Text style={[styles.monthButtonText, isSelected && styles.selectedMonthButtonText]}>
                                {format(date, 'MMM')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    monthScrollBar: {
        maxHeight: 40,
        paddingVertical: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    monthButton: {
        height: 25,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        borderRadius: 7,
        borderColor: '#ccc',
        borderWidth: .5
    },
    selectedMonthButton: {
        backgroundColor: '#4ade80',
    },
    monthButtonText: {
        fontSize: 14,
        color: '#333',
    },
    selectedMonthButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    yearLabel: {
        fontSize: 12,
        marginHorizontal: 6,
        color: '#999',
        paddingVertical: 6,
    },
    scrollView:{
        // position: 'absolute',
        // marginTop: 222,
        // backgroundColor: 'black',
        // borderWidth: .5
    }
});
