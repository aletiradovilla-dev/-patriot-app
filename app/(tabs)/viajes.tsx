import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../../lib/supabase';

type Viaje = {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  tipo: string;
  estado: string;
  aeronave: string;
  precio: number;
};

const estadoColor: Record<string, string> = {
  confirmado: '#4CAF50',
  en_proceso: '#C9A84C',
  completado: '#666',
  cancelado: '#f44336',
};

export default function ViajesScreen() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const fetchViajes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('viajes')
      .select('*')
      .eq('usuario_id', user.id)
      .order('fecha', { ascending: false });
    if (data) setViajes(data);
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchViajes();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchViajes();
  };

  const filtrados = filtro === 'todos' ? viajes : viajes.filter(v => v.estado === filtro);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tag}>MIS VIAJES</Text>
        <Text style={styles.title}>Historial</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {['todos', 'confirmado', 'en_proceso', 'completado', 'cancelado'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFiltro(f)} style={[styles.filtroBtn, filtro === f && styles.filtroBtnActive]}>
            <Text style={[styles.filtroText, filtro === f && styles.filtroTextActive]}>{f.replace('_', ' ').toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C9A84C" />
          }
        >
          {filtrados.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.empty}>No hay viajes</Text>
              <Text style={styles.emptySub}>Desliza hacia abajo para actualizar</Text>
            </View>
          ) : (
            filtrados.map(viaje => (
              <View key={viaje.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.ruta}>{viaje.origen} → {viaje.destino}</Text>
                  <View style={[styles.estadoBadge, { backgroundColor: estadoColor[viaje.estado] + '22' }]}>
                    <Text style={[styles.estadoText, { color: estadoColor[viaje.estado] }]}>{viaje.estado.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.info}>{viaje.fecha} · {viaje.tipo} · {viaje.aeronave}</Text>
                {viaje.precio > 0 && <Text style={styles.precio}>${viaje.precio.toLocaleString()} USD</Text>}
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
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  tag: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 4 },
  title: { fontSize: 28, color: '#fff', fontWeight: '300' },
  filtros: { marginVertical: 12, maxHeight: 44 },
  filtroBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filtroBtnActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  filtroText: { fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  filtroTextActive: { color: '#1B2A4A', fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  empty: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontSize: 14, marginBottom: 8 },
  emptySub: { color: 'rgba(255,255,255,0.15)', textAlign: 'center', fontSize: 12 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', borderRadius: 14, padding: 16, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  ruta: { fontSize: 16, color: '#fff', fontWeight: '500' },
  estadoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  estadoText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  info: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 },
  precio: { fontSize: 14, color: '#C9A84C', fontWeight: '600', marginTop: 4 },
});
