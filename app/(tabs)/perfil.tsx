import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, SafeAreaView,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function PerfilScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');

  const fetchPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setEmail(user.email || '');

    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setNombre(data.nombre || '');
      setTelefono(data.telefono || '');
      setEmpresa(data.empresa || '');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPerfil();
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('perfiles').upsert({
      id: user.id,
      nombre,
      telefono,
      empresa,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEditing(false);
      Alert.alert('Guardado', 'Perfil actualizado correctamente');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) return <ActivityIndicator color="#C9A84C" style={{ flex: 1, backgroundColor: '#0D1B2A' }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.tag}>PERFIL</Text>
        <Text style={styles.title}>Mi cuenta</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
           {nombre ? nombre[0].toUpperCase() : ''}{nombre && nombre.includes(' ') ? nombre.split(' ')[1][0].toUpperCase() : ''}
        </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>{email}</Text>
          </View>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputReadonly]}
            value={nombre}
            onChangeText={setNombre}
            editable={editing}
            placeholder="Tu nombre"
            placeholderTextColor="#444"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputReadonly]}
            value={telefono}
            onChangeText={setTelefono}
            editable={editing}
            placeholder="Tu teléfono"
            placeholderTextColor="#444"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Empresa</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputReadonly]}
            value={empresa}
            onChangeText={setEmpresa}
            editable={editing}
            placeholder="Tu empresa"
            placeholderTextColor="#444"
          />
        </View>

        {editing ? (
          <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
            {saving ? <ActivityIndicator color="#1B2A4A" /> : <Text style={styles.btnSaveText}>Guardar cambios</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnEdit} onPress={() => setEditing(true)}>
            <Text style={styles.btnEditText}>Editar perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  tag: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 4 },
  title: { fontSize: 28, color: '#fff', fontWeight: '300', marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: '#C9A84C', alignItems: 'center', justifyContent: 'center', marginBottom: 32, alignSelf: 'center' },
  avatarText: { fontSize: 28, color: '#C9A84C', fontWeight: '300' },
  form: { gap: 8, marginBottom: 24 },
  label: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
  inputReadonly: { opacity: 0.6 },
  inputDisabled: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 },
  inputDisabledText: { color: 'rgba(255,255,255,0.3)', fontSize: 14 },
  btnSave: { backgroundColor: '#C9A84C', borderRadius: 12, padding: 18, alignItems: 'center', marginBottom: 12 },
  btnSaveText: { color: '#1B2A4A', fontWeight: '700', fontSize: 15 },
  btnEdit: { backgroundColor: 'rgba(201,168,76,0.1)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', borderRadius: 12, padding: 18, alignItems: 'center', marginBottom: 12 },
  btnEditText: { color: '#C9A84C', fontWeight: '600', fontSize: 15 },
  btnLogout: { padding: 16, alignItems: 'center' },
  btnLogoutText: { color: 'rgba(255,255,255,0.25)', fontSize: 13 },
});