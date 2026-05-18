import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView,
    Platform, SafeAreaView, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingresa tu correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch(e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Patriot</Text>
          <Text style={styles.logoSub}>AVIATION</Text>
          <View style={styles.goldLine} />
          <Text style={styles.tagline}>EXECUTIVE AVIATION</Text>
        </View>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            {loading ? <ActivityIndicator color="#1B2A4A" /> : <Text style={styles.btnText}>Iniciar sesión</Text>}
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 60 },
  logoText: { fontSize: 48, color: '#FFFFFF', fontWeight: '300', letterSpacing: 6 },
  logoSub: { fontSize: 12, color: '#C9A84C', letterSpacing: 8, marginTop: -4 },
  goldLine: { width: 40, height: 1, backgroundColor: '#C9A84C', marginVertical: 12 },
  tagline: { fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 4 },
  form: { gap: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
  btn: { backgroundColor: '#C9A84C', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#1B2A4A', fontWeight: '700', fontSize: 15, letterSpacing: 1 },
  forgot: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 12, marginTop: 8 },
});