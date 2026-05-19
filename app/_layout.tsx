import * as Linking from 'expo-linking';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RootLayout() {

  useEffect(() => {
    // Maneja deep links cuando la app está abierta
    const sub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Maneja deep links cuando la app estaba cerrada
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);

  const handleDeepLink = async (url: string) => {
    if (!url) return;

    // Extrae el token del link de Supabase
    const parsed = Linking.parse(url);
    const access_token = parsed.queryParams?.access_token as string;
    const refresh_token = parsed.queryParams?.refresh_token as string;
    const type = parsed.queryParams?.type as string;

    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token });

      if (type === 'recovery') {
        // Reset password
        router.replace('/reset-password');
      } else if (type === 'signup') {
        // Confirmación de email → va al home
        router.replace('/(tabs)/home');
      }
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}