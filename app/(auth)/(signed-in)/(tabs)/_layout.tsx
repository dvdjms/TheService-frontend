import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';



export default function TabLayout() {

  return (
    <Tabs
        screenOptions={{
            headerShown: true,
            headerTitle: () => null,
            headerLeft: () => <DrawerToggleButton />,
        }}>
        <Tabs.Screen 
            name="home/index" options={{
                title: 'Home',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={28} color={color} />
                )
            }} 
        />
        <Tabs.Screen 
            name="appointments/index" 
            options={{ 
                title: 'Appointments',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="calendar-outline" size={28} color={color} />
                )
            }} 
        />
        <Tabs.Screen 
            name="clients/index" options={{
                title: 'Clients',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="people-outline" size={28} color={color} />
                )
            }} 
        />

        <Tabs.Screen
            name="more/index"
            options={{  
                title: 'More',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="ellipsis-horizontal" size={28} color={color} />
                )
            }}
        />
    </Tabs>
  );
}