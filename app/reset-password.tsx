import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, SafeAreaView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      Alert.alert('Error', 'Completa ambos campos');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) Alert.alert('Error', error.message);
      else {
        Alert.alert('¡Listo!', 'Tu contraseña fue actualizada.', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      }
    } catch (e: any) {
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
        </View>
        <Text style={styles.title}>Nueva contraseña</Text>
        <Text style={styles.sub}>Ingresa tu nueva contraseña para continuar.</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#666"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
          <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#1B2A4A" /> : <Text style={styles.btnText}>Actualizar contraseña</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.forgot}>← Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoText: { fontSize: 48, color: '#FFFFFF', fontWeight: '300', letterSpacing: 6 },
  logoSub: { fontSize: 12, color: '#C9A84C', letterSpacing: 8, marginTop: -4 },
  goldLine: { width: 40, height: 1, backgroundColor: '#C9A84C', marginVertical: 12 },
  title: { fontSize: 24, color: '#fff', fontWeight: '300', textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 24 },
  form: { gap: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
  btn: { backgroundColor: '#C9A84C', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#1B2A4A', fontWeight: '700', fontSize: 15, letterSpacing: 1 },
  forgot: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 12, marginTop: 8 },
});