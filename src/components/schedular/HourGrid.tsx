import React, { useMemo } from 'react';
import { Text, View, StyleSheet  } from 'react-native';


const HOUR_HEIGHT = 60
const ListHours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

const HourGrid = React.memo(() => (
    <>
        {ListHours.map((hour) => (
            <View
                key={`hour-${hour}`}
                style={{
                height: HOUR_HEIGHT,
                flexDirection: 'row',
                paddingHorizontal: 5,
                }}
            >
                <View>
                    <Text style={styles.time}>{`${hour}:00`}</Text>
                </View>
                <View style={styles.hourBlockDivider} />
                <View style={styles.hourBlock} />
            </View>
        ))}
    </>
));


const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        // borderTopWidth: 1,
    },
    time: {
        textAlign: 'right', 
        fontWeight: '300', 
        width: 40, 
        marginTop: -9,
    },
    hourBlock: {
        flex: 5,  
        // borderBottomWidth: .5,
        borderTopWidth: .5,
        borderColor: '#eee',
        alignItems: 'stretch',
    },
    hourBlockDivider: {
        marginLeft: 10,
        width: 5, 
        borderRightWidth: 1,
        borderTopWidth: .5,
        borderBottomWidth: .5, 
        borderColor: '#eee' 
    }
});

export default HourGrid;