import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Linking, Platform,
  SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';

type Tramo = { origen: string; destino: string; fecha: Date | null };

export default function ChartersScreen() {
  const [tipoViaje, setTipoViaje] = useState<'ida' | 'redondo' | 'multidestino'>('ida');
  const [tramos, setTramos] = useState<Tramo[]>([{ origen: '', destino: '', fecha: null }]);
  const [activePicker, setActivePicker] = useState<number | null>(null);
  const [pax, setPax] = useState('1');
  const [notas, setNotas] = useState('');

  const formatDate = (date: Date) =>
    date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const updateTramo = (index: number, field: keyof Tramo, value: any) => {
    const updated = [...tramos];
    updated[index] = { ...updated[index], [field]: value };
    setTramos(updated);
  };

  const handleTipoViaje = (tipo: 'ida' | 'redondo' | 'multidestino') => {
    setTipoViaje(tipo);
    if (tipo === 'ida') setTramos([{ origen: '', destino: '', fecha: null }]);
    if (tipo === 'redondo') setTramos([
      { origen: '', destino: '', fecha: null },
      { origen: '', destino: '', fecha: null },
    ]);
    if (tipo === 'multidestino') setTramos([
      { origen: '', destino: '', fecha: null },
      { origen: '', destino: '', fecha: null },
    ]);
  };

  const addTramo = () => {
    if (tramos.length < 5) {
      setTramos([...tramos, { origen: '', destino: '', fecha: null }]);
    }
  };

  const handleSolicitar = () => {
    const valid = tramos.every(t => t.origen && t.destino && t.fecha);
    if (!valid) {
      Alert.alert('Error', 'Completa origen, destino y fecha de todos los tramos');
      return;
    }
    const tipo = tipoViaje === 'ida' ? 'Solo ida' : tipoViaje === 'redondo' ? 'Ida y vuelta' : 'Multidestino';
    const tramosStr = tramos.map((t, i) =>
      `*Tramo ${i + 1}:* ${t.origen} → ${t.destino} · ${formatDate(t.fecha!)}`
    ).join('\n');
    const msg = `✈️ *Solicitud de Charter - Patriot Aviation*\n\n*Tipo:* ${tipo}\n${tramosStr}\n*Pasajeros:* ${pax}\n*Notas:* ${notas || 'Ninguna'}\n\n_App Patriot Aviation_`;
    Linking.openURL(`https://wa.me/527225592758?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* HERO */}
          <Text style={styles.tag}>CHARTER PRIVADO</Text>
          <Text style={styles.title}>Cotiza tu vuelo</Text>
          <Text style={styles.sub}>Tu avión, tu ruta, tu horario.</Text>
          <View style={styles.divider} />

          {/* TIPO DE VIAJE */}
          <Text style={styles.sectionTitle}>Tipo de viaje</Text>
          <View style={styles.tipoRow}>
            {(['ida', 'redondo', 'multidestino'] as const).map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[styles.tipoBtn, tipoViaje === tipo && styles.tipoBtnActive]}
                onPress={() => handleTipoViaje(tipo)}
              >
                <Text style={[styles.tipoBtnText, tipoViaje === tipo && styles.tipoBtnTextActive]}>
                  {tipo === 'ida' ? 'Solo ida' : tipo === 'redondo' ? 'Ida y vuelta' : 'Multidestino'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.divider} />

          {/* RUTA */}
          <Text style={styles.sectionTitle}>Ruta</Text>
          {tramos.map((tramo, i) => (
            <View key={i} style={styles.tramoBox}>
              {tramos.length > 1 && (
                <Text style={styles.tramoLabel}>
                  {tipoViaje === 'redondo'
                    ? i === 0 ? '✈  IDA' : '✈  VUELTA'
                    : `✈  TRAMO ${i + 1}`}
                </Text>
              )}
              <Text style={styles.label}>Origen</Text>
              <TextInput
                style={styles.input}
                placeholder="Ciudad de origen"
                placeholderTextColor="#444"
                value={tramo.origen}
                onChangeText={(v) => updateTramo(i, 'origen', v)}
              />
              <Text style={styles.label}>Destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ciudad de destino"
                placeholderTextColor="#444"
                value={tramo.destino}
                onChangeText={(v) => updateTramo(i, 'destino', v)}
              />
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setActivePicker(i)}>
                <Text style={tramo.fecha ? styles.dateText : styles.datePlaceholder}>
                  {tramo.fecha ? formatDate(tramo.fecha) : 'Selecciona una fecha'}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#C9A84C" />
              </TouchableOpacity>
              {activePicker === i && (
                <DateTimePicker
                  value={tramo.fecha || new Date()}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setActivePicker(null);
                    if (selectedDate) updateTramo(i, 'fecha', selectedDate);
                  }}
                />
              )}
            </View>
          ))}

          {/* AGREGAR TRAMO */}
          {tipoViaje === 'multidestino' && tramos.length < 5 && (
            <TouchableOpacity style={styles.addTramoBtn} onPress={addTramo}>
              <Ionicons name="add-circle-outline" size={18} color="#C9A84C" />
              <Text style={styles.addTramoText}>Agregar destino</Text>
            </TouchableOpacity>
          )}


{/* DETALLES */}
          <View style={{ height: 20 }} />
          <Text style={styles.sectionTitle}>Detalles</Text>
          <Text style={styles.label}>Pasajeros</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor="#444"
            value={pax}
            onChangeText={setPax}
            keyboardType="number-pad"
          />
          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Requerimientos especiales..."
            placeholderTextColor="#444"
            value={notas}
            onChangeText={setNotas}
            multiline
            numberOfLines={3}
          />

          <View style={styles.divider} />

          <TouchableOpacity style={styles.btn} onPress={handleSolicitar}>
            <Ionicons name="logo-whatsapp" size={18} color="white" />
            <Text style={styles.btnText}>Solicitar por WhatsApp</Text>
          </TouchableOpacity>

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
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 20 },
  divider: { height: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginVertical: 20 },
  sectionTitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginBottom: 12, textTransform: 'uppercase' },
  label: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
  textarea: { height: 90, textAlignVertical: 'top' },
  tipoRow: { flexDirection: 'row', gap: 8 },
  tipoBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  tipoBtnActive: { backgroundColor: 'rgba(201,168,76,0.15)', borderColor: '#C9A84C' },
  tipoBtnText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  tipoBtnTextActive: { color: '#C9A84C' },
  tramoBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  tramoLabel: { fontSize: 10, color: '#C9A84C', letterSpacing: 3, marginBottom: 8, fontWeight: '700' },
  dateInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: '#fff', fontSize: 14 },
  datePlaceholder: { color: '#444', fontSize: 14 },
  addTramoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', borderStyle: 'dashed', justifyContent: 'center', marginBottom: 12 },
  addTramoText: { color: '#C9A84C', fontSize: 13, fontWeight: '500' },
  btn: { backgroundColor: '#128C7E', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
