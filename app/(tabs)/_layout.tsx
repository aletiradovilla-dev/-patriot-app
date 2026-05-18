import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0D1B2A',
        borderTopColor: 'rgba(201,168,76,0.2)',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: '#C9A84C',
      tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
      tabBarLabelStyle: { fontSize: 9, letterSpacing: 0.5 },
      tabBarIcon: () => null,
      tabBarIconStyle: { display: 'none' },
    }}>
      <Tabs.Screen name="home" options={{ title: 'HOME' }} />
      <Tabs.Screen name="empty-legs" options={{ title: 'EMPTY LEGS' }} />
      <Tabs.Screen name="charters" options={{ title: 'CHARTERS' }} />
      <Tabs.Screen name="viajes" options={{ title: 'VIAJES' }} />
      <Tabs.Screen name="perfil" options={{ title: 'PERFIL' }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
