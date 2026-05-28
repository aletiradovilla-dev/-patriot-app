import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView,
  Platform, SafeAreaView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [modo, setModo] = useState<'login' | 'registro' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingresa tu correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Error', error.message);
      else {
        if (data.user) {
          const { data: perfil } = await supabase
            .from('perfiles')
            .select('id')
            .eq('id', data.user.id)
            .single();
          if (!perfil) {
            await supabase.from('perfiles').upsert({
              id: data.user.id,
              nombre: data.user.user_metadata?.full_name || '',
              updated_at: new Date().toISOString(),
            });
          }
        }
        router.replace('/(tabs)/home');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async () => {
    if (!email || !password || !nombre || !telefono) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: nombre } }
      });
      if (error) Alert.alert('Error', error.message);
      else {
        if (data.user) {
          await supabase.from('perfiles').upsert({
            id: data.user.id,
            nombre,
            telefono,
            updated_at: new Date().toISOString(),
          });
        }
        Alert.alert('¡Cuenta creada!', 'Ya puedes iniciar sesión.', [
          { text: 'OK', onPress: () => setModo('login') }
        ]);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

const handleForgot = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingresa tu correo electrónico');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
      if (error) {
        Alert.alert('Error detalle', error.message + ' | ' + error.status + ' | ' + JSON.stringify(error));
      } else {
        Alert.alert('Correo enviado ✓', 'Revisa tu bandeja y spam.',
          [{ text: 'OK', onPress: () => setModo('login') }]
        );
      }
    } catch (e: any) {
      Alert.alert('Error catch', JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };


  return (
    <ImageBackground
      source={require('../assets/images/login-bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Patriot</Text>
            <Text style={styles.logoSub}>AVIATION</Text>
            <View style={styles.goldLine} />
            <Text style={styles.tagline}>EXECUTIVE AVIATION</Text>
          </View>

          {modo !== 'forgot' && (
            <View style={styles.modoRow}>
              <TouchableOpacity
                style={[styles.modoBtn, modo === 'login' && styles.modoBtnActive]}
                onPress={() => setModo('login')}
              >
                <Text style={[styles.modoBtnText, modo === 'login' && styles.modoBtnTextActive]}>
                  Iniciar sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modoBtn, modo === 'registro' && styles.modoBtnActive]}
                onPress={() => setModo('registro')}
              >
                <Text style={[styles.modoBtnText, modo === 'registro' && styles.modoBtnTextActive]}>
                  Crear cuenta
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {modo === 'login' && (
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="rgba(255,255,255,0.4)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="rgba(255,255,255,0.4)" value={password} onChangeText={setPassword} secureTextEntry />
              <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#1B2A4A" /> : <Text style={styles.btnText}>Iniciar sesión</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModo('forgot')}>
                <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          )}

          {modo === 'registro' && (
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor="rgba(255,255,255,0.4)" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
              <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="rgba(255,255,255,0.4)" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="rgba(255,255,255,0.4)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Contraseña (mín. 6 caracteres)" placeholderTextColor="rgba(255,255,255,0.4)" value={password} onChangeText={setPassword} secureTextEntry />
              <TouchableOpacity style={styles.btn} onPress={handleRegistro} disabled={loading}>
                {loading ? <ActivityIndicator color="#1B2A4A" /> : <Text style={styles.btnText}>Crear cuenta</Text>}
              </TouchableOpacity>
            </View>
          )}

          {modo === 'forgot' && (
            <View style={styles.form}>
              <Text style={styles.forgotTitle}>Recuperar contraseña</Text>
              <Text style={styles.forgotSub}>Te enviaremos un correo para restablecer tu contraseña.</Text>
              <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="rgba(255,255,255,0.4)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <TouchableOpacity style={styles.btn} onPress={handleForgot} disabled={loading}>
                {loading ? <ActivityIndicator color="#1B2A4A" /> : <Text style={styles.btnText}>Enviar correo</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModo('login')}>
                <Text style={styles.forgot}>← Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </View>
          )}

        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,27,42,0.85)' },
  safe: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 52, color: '#FFFFFF', fontWeight: '300', letterSpacing: 6 },
  logoSub: { fontSize: 12, color: '#C9A84C', letterSpacing: 8, marginTop: -4 },
  goldLine: { width: 40, height: 1, backgroundColor: '#C9A84C', marginVertical: 12 },
  tagline: { fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 4 },
  modoRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  modoBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  modoBtnActive: { backgroundColor: '#C9A84C' },
  modoBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  modoBtnTextActive: { color: '#1B2A4A' },
  form: { gap: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
  btn: { backgroundColor: '#C9A84C', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#1B2A4A', fontWeight: '700', fontSize: 15, letterSpacing: 1 },
  forgot: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 12, marginTop: 8 },
  forgotTitle: { fontSize: 24, color: '#fff', fontWeight: '300', textAlign: 'center', marginBottom: 8 },
  forgotSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 8 },
});
