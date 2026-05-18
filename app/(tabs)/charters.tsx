import { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    SafeAreaView, ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';

export default function ChartersScreen() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [pax, setPax] = useState('1');
  const [notas, setNotas] = useState('');

  const handleSolicitar = () => {
    if (!origen || !destino || !fecha) {
      Alert.alert('Error', 'Completa origen, destino y fecha');
      return;
    }
    const msg = `✈️ *Solicitud de Charter - Patriot Aviation*\n\n*Origen:* ${origen}\n*Destino:* ${destino}\n*Fecha:* ${fecha}\n*Pasajeros:* ${pax}\n*Notas:* ${notas || 'Ninguna'}\n\n_App Patriot Aviation_`;
    const url = `https://wa.me/527293332951?text=${encodeURIComponent(msg)}`;
    require('react-native').Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.tag}>CHARTER PRIVADO</Text>
          <Text style={styles.title}>Cotiza tu vuelo</Text>
          <Text style={styles.sub}>Tu avión, tu ruta, tu horario.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Origen</Text>
            <TextInput style={styles.input} placeholder="Ciudad de origen" placeholderTextColor="#444" value={origen} onChangeText={setOrigen} />

            <Text style={styles.label}>Destino</Text>
            <TextInput style={styles.input} placeholder="Ciudad de destino" placeholderTextColor="#444" value={destino} onChangeText={setDestino} />

            <Text style={styles.label}>Fecha</Text>
            <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#444" value={fecha} onChangeText={setFecha} />

            <Text style={styles.label}>Pasajeros</Text>
            <TextInput style={styles.input} placeholder="1" placeholderTextColor="#444" value={pax} onChangeText={setPax} keyboardType="number-pad" />

            <Text style={styles.label}>Notas adicionales</Text>
            <TextInput style={[styles.input, styles.textarea]} placeholder="Requerimientos especiales..." placeholderTextColor="#444" value={notas} onChangeText={setNotas} multiline numberOfLines={3} />

            <TouchableOpacity style={styles.btn} onPress={handleSolicitar}>
              <Text style={styles.btnText}>Solicitar por WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  tag: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 4 },
  title: { fontSize: 28, color: '#fff', fontWeight: '300', marginBottom: 4 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 32 },
  form: { gap: 8 },
  label: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
  textarea: { height: 90, textAlignVertical: 'top' },
  btn: { backgroundColor: '#25D366', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
