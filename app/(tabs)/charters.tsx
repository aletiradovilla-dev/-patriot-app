import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Linking, Platform,
  SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useProfile } from '../../hooks/useProfile';

const WHATSAPP = '527225592758';

type Tramo = { origen: string; destino: string; fecha: Date | null };

export default function ChartersScreen() {
 const [tipoViaje, setTipoViaje] = useState<'ida' | 'redondo' | 'multidestino'>('ida');
 const [tramos, setTramos] = useState<Tramo[]>([{ origen: '', destino: '', fecha: null }]);
 const [activePicker, setActivePicker] = useState<number | null>(null);
 const [pax, setPax] = useState('1');
 const [notas, setNotas] = useState('');
 const [tipoAvion, setTipoAvion] = useState('');
 const profile = useProfile();

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
   if (tramos.length < 5) setTramos([...tramos, { origen: '', destino: '', fecha: null }]);
 };

 const handleSolicitar = () => {
   const valid = tramos.every(t => t.origen && t.destino && t.fecha);
   if (!valid) {
     Alert.alert('Error', 'Completa origen, destino y fecha de todos los tramos');
     return;
   }
   const tipo = tipoViaje === 'ida' ? 'Solo ida' : tipoViaje === 'redondo' ? 'Ida y vuelta' : 'Multidestino';
   const tramosStr = tramos.map((t, i) =>
     `*Tramo ${i + 1}:* ${t.origen} -> ${t.destino} - ${formatDate(t.fecha!)}`
   ).join('\n');
   const msg = `Solicitud de Charter - Patriot Aviation\n\nCliente: ${profile.nombre || 'No registrado'}\nEmail: ${profile.email}\nTelefono: ${profile.telefono || 'No registrado'}\nTipo de viaje: ${tipo}\n${tramosStr}\nPasajeros: ${pax}\nTipo de avion: ${tipoAvion || 'Sin preferencia'}\nNotas: ${notas || 'Ninguna'}\n\nApp Patriot Aviation`;
   Linking.openURL(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`);
 };

 const aviones = [
   { label: 'Light Jet', icon: 'airplane-outline' },
   { label: 'Mid-Size', icon: 'airplane-outline' },
   { label: 'Heavy Jet', icon: 'airplane-outline' },
   { label: 'Helicoptero', icon: 'navigate-outline' },
 ];

 return (
   <SafeAreaView style={styles.container}>
     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
       <ScrollView contentContainerStyle={styles.content}>

         <Text style={styles.tag}>CHARTER PRIVADO</Text>
         <Text style={styles.title}>Cotiza tu vuelo</Text>
         <Text style={styles.sub}>Tu avion, tu ruta, tu horario.</Text>
         <View style={styles.divider} />

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

         <Text style={styles.sectionTitle}>Ruta</Text>
         {tramos.map((tramo, i) => (
           <View key={i} style={styles.tramoBox}>
             {tramos.length > 1 && (
               <Text style={styles.tramoLabel}>
                 {tipoViaje === 'redondo'
                   ? i === 0 ? 'IDA' : 'VUELTA'
                   : `TRAMO ${i + 1}`}
               </Text>
             )}
             <Text style={styles.label}>Origen</Text>
             <TextInput style={styles.input} placeholder="Ciudad de origen" placeholderTextColor="rgba(255,255,255,0.2)" value={tramo.origen} onChangeText={(v) => updateTramo(i, 'origen', v)} />
             <Text style={styles.label}>Destino</Text>
             <TextInput style={styles.input} placeholder="Ciudad de destino" placeholderTextColor="rgba(255,255,255,0.2)" value={tramo.destino} onChangeText={(v) => updateTramo(i, 'destino', v)} />
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

         {tipoViaje === 'multidestino' && tramos.length < 5 && (
           <TouchableOpacity style={styles.addTramoBtn} onPress={addTramo}>
             <Ionicons name="add-circle-outline" size={18} color="#C9A84C" />
             <Text style={styles.addTramoText}>Agregar destino</Text>
           </TouchableOpacity>
         )}

         <View style={styles.divider} />
         <Text style={styles.sectionTitle}>Detalles</Text>

         <Text style={styles.label}>Pasajeros</Text>
         <TextInput style={styles.input} placeholder="1" placeholderTextColor="rgba(255,255,255,0.2)" value={pax} onChangeText={setPax} keyboardType="number-pad" />

         <Text style={styles.label}>Tipo de aeronave <Text style={styles.opcional}>(opcional)</Text></Text>
         <View style={styles.avionGrid}>
           {aviones.map((a) => (
             <TouchableOpacity
               key={a.label}
               style={[styles.avionBtn, tipoAvion === a.label && styles.avionBtnActive]}
               onPress={() => setTipoAvion(tipoAvion === a.label ? '' : a.label)}
             >
               <Ionicons
                 name={a.icon as any}
                 size={18}
                 color={tipoAvion === a.label ? '#C9A84C' : 'rgba(255,255,255,0.3)'}
               />
               <Text style={[styles.avionBtnText, tipoAvion === a.label && styles.avionBtnTextActive]}>
                 {a.label}
               </Text>
             </TouchableOpacity>
           ))}
         </View>

         <Text style={styles.label}>Notas adicionales</Text>
         <TextInput style={[styles.input, styles.textarea]} placeholder="Requerimientos especiales..." placeholderTextColor="rgba(255,255,255,0.2)" value={notas} onChangeText={setNotas} multiline numberOfLines={3} />

         <View style={styles.divider} />

         <TouchableOpacity style={styles.btn} onPress={handleSolicitar}>
           <Ionicons name="logo-whatsapp" size={20} color="white" />
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
 sectionTitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginBottom: 16 },
 label: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
 opcional: { color: 'rgba(255,255,255,0.2)', fontSize: 10 },
 input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14 },
 textarea: { height: 90, textAlignVertical: 'top' },
 tipoRow: { flexDirection: 'row', gap: 8 },
 tipoBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
 tipoBtnActive: { backgroundColor: 'rgba(201,168,76,0.12)', borderColor: '#C9A84C' },
 tipoBtnText: { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
 tipoBtnTextActive: { color: '#C9A84C', fontWeight: '600' },
 tramoBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
 tramoLabel: { fontSize: 10, color: '#C9A84C', letterSpacing: 3, marginBottom: 12, fontWeight: '700' },
 dateInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
 dateText: { color: '#fff', fontSize: 14 },
 datePlaceholder: { color: 'rgba(255,255,255,0.2)', fontSize: 14 },
 addTramoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)', borderStyle: 'dashed', justifyContent: 'center', marginBottom: 4 },
 addTramoText: { color: '#C9A84C', fontSize: 13, fontWeight: '500' },
 avionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
 avionBtn: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' },
 avionBtnActive: { backgroundColor: 'rgba(201,168,76,0.12)', borderColor: '#C9A84C' },
 avionBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
 avionBtnTextActive: { color: '#C9A84C', fontWeight: '600' },
 btn: { backgroundColor: '#128C7E', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
 btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
