import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '../../src/components/ui/IconSymbol';


export default function TabLayout() {

  return (
    <Tabs>
      <Tabs.Screen name="(home)" options={{
            title: 'Home',
            href: '/', 
            headerShown: false, 
            tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
            )
        }} />
      <Tabs.Screen name="appointments" options={{ 
            title: 'Appointments',
            href: '/appointments', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="calendar" color={color} />
            )
        }} />
      <Tabs.Screen name="clients" options={{
            title: 'Clients',
            href: '/register', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="person.2.fill" color={color} />
            )
        }} />
      <Tabs.Screen name="settings" options={{
            title: 'Settings', 
            href: '/login', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="gearshape" color={color} />
            )
        }} />
    </Tabs>
  );
}