import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Client } from '../types/Service';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental?.(true);

interface Props {
    client: Client;
}

export const ClientAddress = ({ client }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);

    const toggle = () => {
        setExpanded(prev => !prev);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        height.value = withTiming(expanded ? 0 : 120, { duration: 300 });
        opacity.value = withTiming(expanded ? 0 : 1, { duration: 300 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        opacity: opacity.value,
        overflow: 'hidden',
    }));

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggle}>
                <View style={styles.addressTile}>
                    <Ionicons name="location-outline" size={22} />
                    <Text style={styles.title}>Address</Text>
                </View>
            </TouchableOpacity>
            <Animated.View style={[styles.addressDropdown, animatedStyle]}>
                {(client.address1 || client.city || client.stateOrProvince || client.postalCode) ? (
                    <>
                    <Text style={styles.addressLine}>{client.address1}</Text>
                        {!!client.address2 && <Text style={styles.addressLine}>{client.address2}</Text>}
                        {!!client.city && <Text style={styles.addressLine}>{client.city}</Text>}
                        {!!client.stateOrProvince && <Text style={styles.addressLine}>{client.stateOrProvince}</Text>}
                        {!!client.postalCode && <Text style={styles.addressLine}>{client.postalCode}</Text>}
                    </>
                    ) : (
                        <Text style={styles.addressLine}>No address added</Text>
                    )
                }
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        width: '100%',
    },
    addressTile: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        width: '100%',
        marginBottom: 4,
        gap: 5
    },
    title: {
        fontSize: 14,
    },
    addressDropdown: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 4,
    },
    addressLine: {
        fontSize: 13,
        textAlign: 'center',
        color: '#444',
        paddingVertical: 1,
    },
});
