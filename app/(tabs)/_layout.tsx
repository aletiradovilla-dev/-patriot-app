import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';

const TAB_WIDTH = Dimensions.get('window').width / 5;

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0D1B2A',
        borderTopColor: 'rgba(201,168,76,0.2)',
        height: 70,
        paddingBottom: 10,
        paddingTop: 8,
      },
      tabBarActiveTintColor: '#C9A84C',
      tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
      tabBarLabelStyle: { fontSize: 9, fontWeight: '600', marginTop: 2 },
      tabBarItemStyle: { width: TAB_WIDTH },
    }}>
      <Tabs.Screen name="home" options={{ title: 'HOME', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} /> }} />
      <Tabs.Screen name="empty-legs" options={{ title: 'EMPTY', tabBarIcon: ({ color }) => <Ionicons name="airplane-outline" size={20} color={color} /> }} />
      <Tabs.Screen name="charters" options={{ title: 'CHARTER', tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={20} color={color} /> }} />
      <Tabs.Screen name="membresias" options={{ title: 'PLANES', tabBarIcon: ({ color }) => <Ionicons name="briefcase-outline" size={20} color={color} /> }} />
      <Tabs.Screen name="quienes" options={{ title: 'QUIÉNES', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={20} color={color} /> }} />
      <Tabs.Screen name="viajes" options={{ href: null }} />
      <Tabs.Screen name="perfil" options={{ href: null }} />
      <Tabs.Screen name="flota" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}