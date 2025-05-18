import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';



interface Props {
    startTime: string; 
    endTime: string;
}

export default function AddAppointment({ startTime, endTime }: Props) {

    // when hour is touch or block highlighted then slide in 'add client' 
    return (
        <Animated.View>



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

});