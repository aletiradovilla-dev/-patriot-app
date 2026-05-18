import { useEffect, useState } from 'react';
import {
    ActivityIndicator, SafeAreaView, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    fetchVuelos();
  }, []);

  const fetchVuelos = async () => {
    const { data, error } = await supabase
      .from('empty_legs')
      .select('*')
      .eq('estado', 'disponible')
      .order('fecha', { ascending: true });

    if (data) setVuelos(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tag}>EMPTY LEGS</Text>
        <Text style={styles.title}>Vuelos disponibles</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {vuelos.length === 0 ? (
            <Text style={styles.empty}>No hay vuelos disponibles</Text>
          ) : (
            vuelos.map((vuelo) => (
              <TouchableOpacity key={vuelo.id} style={styles.card}>
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
              </TouchableOpacity>
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
  title: { fontSize: 28, color: '#fff', fontWeight: '300' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  empty: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40, fontSize: 14 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', borderRadius: 16, padding: 20, marginBottom: 12 },
  ruta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  ciudad: { fontSize: 20, color: '#fff', fontWeight: '500' },
  flecha: { fontSize: 16, color: '#C9A84C' },
  info: { gap: 4, marginBottom: 14 },
  infoText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  precios: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 14 },
  precioLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 },
  precio: { fontSize: 15, color: '#C9A84C', fontWeight: '600' },
});
