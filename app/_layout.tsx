import * as Linking from 'expo-linking';
import { router, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(lineAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.splash}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.splashLogo}>Patriot</Text>
        <Text style={styles.splashSub}>AVIATION</Text>
        <View style={styles.splashDivider} />
        <Text style={styles.splashTagline}>EXECUTIVE AVIATION</Text>
      </Animated.View>
      <Animated.View style={[styles.splashBottom, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.splashLine, { width: lineAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '40%'] }) }]} />
        <Text style={styles.splashSlogan}>Tu tiempo vuela</Text>
        <Animated.View style={[styles.splashLine, { width: lineAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '40%'] }) }]} />
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(true);
      if (!showSplash) {
        if (session) router.replace('/(tabs)/home');
        else router.replace('/login');
      }
    });

    return () => sub.remove();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    if (ready) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) router.replace('/(tabs)/home');
        else router.replace('/login');
      });
    }
  };

  const handleDeepLink = async (url: string) => {
    if (!url) return;
    const parsed = Linking.parse(url);
    const access_token = parsed.queryParams?.access_token as string;
    const refresh_token = parsed.queryParams?.refresh_token as string;
    const type = parsed.queryParams?.type as string;

    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token });
      if (type === 'recovery') router.replace('/reset-password');
      else if (type === 'signup') router.replace('/(tabs)/home');
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#0D1B2A', alignItems: 'center', justifyContent: 'center' },
  splashLogo: { fontSize: 48, color: '#fff', fontWeight: '300', letterSpacing: 6 },
  splashSub: { fontSize: 12, color: '#C9A84C', letterSpacing: 8, marginTop: 4 },
  splashDivider: { width: 40, height: 1, backgroundColor: 'rgba(201,168,76,0.3)', marginVertical: 16 },
  splashTagline: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 6 },
  splashBottom: { position: 'absolute', bottom: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', paddingHorizontal: 24 },
  splashLine: { height: 1, backgroundColor: 'rgba(201,168,76,0.4)' },
  splashSlogan: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 3 },
});
