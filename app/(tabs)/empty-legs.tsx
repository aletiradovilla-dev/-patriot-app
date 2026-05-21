import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Linking, RefreshControl, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { useProfile } from '../../hooks/useProfile';
import { supabase } from '../../lib/supabase';

const WHATSAPP = '527225592758';

type EmptyLeg = {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  precio_asiento: number;
  precio_cabina: number;
  aeronave: string;
  asientos: number;
  estado: string;
};

export default function EmptyLegsScreen() {
  const [vuelos, setVuelos] = useState<EmptyLeg[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const profile = useProfile();

  const fetchVuelos = async () => {
    const { data } = await supabase
      .from('empty_legs')
      .select('*')
      .eq('estado', 'disponible')
      .order('fecha', { ascending: true });
    if (data) setVuelos(data);
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchVuelos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchVuelos();
  };

  const handleWhatsApp = (vuelo: EmptyLeg, tipo: 'asiento' | 'cabina') => {
    const precio = tipo === 'asiento'
      ? `$${vuelo.precio_asiento.toLocaleString()} USD por asiento`
      : `$${vuelo.precio_cabina.toLocaleString()} USD cabina completa`;

    const msg = `✈️ *Reserva de Empty Leg - Patriot Aviation*\n\n*Cliente:* ${profile.nombre || 'No registrado'}\n*Email:* ${profile.email}\n*Teléfono:* ${profile.telefono || 'No registrado'}\n*Ruta:* ${vuelo.origen} → ${vuelo.destino}\n*Fecha:* ${vuelo.fecha}\n*Hora:* ${vuelo.hora}\n*Aeronave:* ${vuelo.aeronave}\n*Pasajeros:* ${vuelo.asientos} pax\n*Opción:* ${precio}\n\n_Me interesa reservar este vuelo._`;

    Linking.openURL(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tag}>EMPTY LEGS</Text>
        <Text style={styles.title}>Vuelos disponibles</Text>
        <Text style={styles.sub}>Asientos a precio especial en rutas confirmadas.</Text>
      </View>
      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C9A84C" />
          }
        >
          {vuelos.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>✈</Text>
              <Text style={styles.emptyText}>No hay vuelos disponibles</Text>
              <Text style={styles.emptySub}>Desliza hacia abajo para actualizar</Text>
            </View>
          ) : (
            vuelos.map((vuelo) => (
              <View key={vuelo.id} style={styles.card}>
                <View style={styles.ruta}>
                  <Text style={styles.ciudad}>{vuelo.origen}</Text>
                  <Text style={styles.flecha}>→</Text>
                  <Text style={styles.ciudad}>{vuelo.destino}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoText}>{vuelo.fecha} · {vuelo.hora}</Text>
                  <Text style={styles.infoText}>{vuelo.aeronave} · {vuelo.asientos} pax</Text>
                </View>
                <View style={styles.precios}>
                  <View>
                    <Text style={styles.precioLabel}>Por asiento</Text>
                    <Text style={styles.precio}>${vuelo.precio_asiento.toLocaleString()} USD</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.precioLabel}>Cabina completa</Text>
                    <Text style={styles.precio}>${vuelo.precio_cabina.toLocaleString()} USD</Text>
                  </View>
                </View>
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.btnWA}
                    onPress={() => handleWhatsApp(vuelo, 'asiento')}
                  >
                    <Ionicons name="logo-whatsapp" size={14} color="white" />
                    <Text style={styles.btnWAText}>Reservar asiento</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnWA, styles.btnWAGold]}
                    onPress={() => handleWhatsApp(vuelo, 'cabina')}
                  >
                    <Ionicons name="logo-whatsapp" size={14} color="#1B2A4A" />
                    <Text style={[styles.btnWAText, { color: '#1B2A4A' }]}>Cabina completa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  tag: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 4 },
  title: { fontSize: 28, color: '#fff', fontWeight: '300', marginBottom: 4 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.3)' },
  divider: { height: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginHorizontal: 24, marginBottom: 20 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 16 },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: '500', marginBottom: 6 },
  emptySub: { color: 'rgba(255,255,255,0.25)', fontSize: 13 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', borderRadius: 16, padding: 20, marginBottom: 12 },
  ruta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  ciudad: { fontSize: 20, color: '#fff', fontWeight: '500' },
  flecha: { fontSize: 16, color: '#C9A84C' },
  info: { gap: 4, marginBottom: 14 },
  infoText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  precios: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 14, marginBottom: 14 },
  precioLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 },
  precio: { fontSize: 15, color: '#C9A84C', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 8 },
  btnWA: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#128C7E', borderRadius: 10, padding: 12 },
  btnWAGold: { backgroundColor: '#C9A84C' },
  btnWAText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});