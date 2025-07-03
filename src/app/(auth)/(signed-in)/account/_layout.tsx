import { router, Stack } from 'expo-router';
import HomeIcon from '@/src/components/ui/HomeIcon';
import { CustomHeaderRight, HamburgerHeaderLeft } from '@/src/components/ui/CustomHeader';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function AccountLayout() {
    const backIcon = Platform.OS === "ios" ? "chevron-back" : "arrow-back-sharp";

    return (
        <Stack 
            screenOptions={{ 
                headerShown: false,
                headerTitle: '',
                headerStyle: {
                    backgroundColor: 'green',
                },
                headerLeft: () => (
                    <CustomHeaderRight />
                ),
                headerRight: () => (
                    <CustomHeaderRight />
                )
            }}>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,  
                    title: '',
                    headerLeft: () => (
                        <CustomHeaderRight />
                    ),
                    headerRight: () => (
                        <CustomHeaderRight />
                    )
                }}
            />
            
            <Stack.Screen 
                name="plan" 
                options={{ 
                    headerShown: false,  
                    title: '',
                    headerRight: () => (
                        <HomeIcon onPress={() => router.push('/home')} />
                    ),
                    headerLeft: () => (
                        <Ionicons
                            name={backIcon}
                            size={25}
                            color="white"
                            onPress={() => router.back()}
                        />
                    ),
                }} 
            />
        </Stack>
    )
}