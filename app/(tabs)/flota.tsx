import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Image, SafeAreaView, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../../lib/supabase';

type Avion = {
  id: number;
  matricula: string;
  modelo: string;
  tipo: string;
  pasajeros: number;
  wc: boolean;
  cabina: string;
  horas_max: string;
  maletas: number;
  sobrecargo: boolean;
  foto_url: string;
  estado: string;
};

export default function FlotaScreen() {
  const [flota, setFlota] = useState<Avion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Avion | null>(null);

  useEffect(() => {
    fetchFlota();
  }, []);

  const fetchFlota = async () => {
    const { data } = await supabase
      .from('flota')
      .select('*')
      .eq('estado', 'disponible')
      .order('modelo', { ascending: true });
    if (data) setFlota(data);
    setLoading(false);
  };

  if (selected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selected.modelo}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {selected.foto_url ? (
            <Image source={{ uri: selected.foto_url }} style={styles.detailImg} resizeMode="cover" />
          ) : (
            <View style={styles.detailImgPlaceholder}>
              <Ionicons name="airplane-outline" size={60} color="rgba(201,168,76,0.3)" />
            </View>
          )}
          <View style={styles.detailContent}>
            <Text style={styles.detailMatricula}>{selected.matricula}</Text>
            <Text style={styles.detailModelo}>{selected.modelo}</Text>
            <Text style={styles.detailTipo}>{selected.tipo}</Text>
            <View style={styles.divider} />
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Ionicons name="people-outline" size={20} color="#C9A84C" />
                <Text style={styles.specValue}>{selected.pasajeros}</Text>
                <Text style={styles.specLabel}>Pasajeros</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="briefcase-outline" size={20} color="#C9A84C" />
                <Text style={styles.specValue}>{selected.maletas}</Text>
                <Text style={styles.specLabel}>Maletas</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="time-outline" size={20} color="#C9A84C" />
                <Text style={styles.specValue}>{selected.horas_max}</Text>
                <Text style={styles.specLabel}>Alcance</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="resize-outline" size={20} color="#C9A84C" />
                <Text style={styles.specValue}>{selected.cabina}</Text>
                <Text style={styles.specLabel}>Cabina</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.featuresRow}>
              <View style={[styles.featureBadge, selected.wc && styles.featureBadgeActive]}>
                <Ionicons name={selected.wc ? 'checkmark-circle' : 'close-circle'} size={14} color={selected.wc ? '#C9A84C' : 'rgba(255,255,255,0.2)'} />
                <Text style={[styles.featureText, selected.wc && styles.featureTextActive]}>WC a bordo</Text>
              </View>
              <View style={[styles.featureBadge, selected.sobrecargo && styles.featureBadgeActive]}>
                <Ionicons name={selected.sobrecargo ? 'checkmark-circle' : 'close-circle'} size={14} color={selected.sobrecargo ? '#C9A84C' : 'rgba(255,255,255,0.2)'} />
                <Text style={[styles.featureText, selected.sobrecargo && styles.featureTextActive]}>Sobrecargo</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuestra Flota</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTag}>FLOTA PATRIOT</Text>
        <Text style={styles.heroTitle}>Aeronaves de <Text style={styles.heroGold}>alto rendimiento</Text></Text>
      </View>
      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {flota.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="airplane-outline" size={48} color="rgba(201,168,76,0.3)" />
              <Text style={styles.emptyText}>No hay aeronaves disponibles</Text>
            </View>
          ) : (
            flota.map((avion) => (
              <TouchableOpacity key={avion.id} style={styles.card} onPress={() => setSelected(avion)}>
                {avion.foto_url ? (
                  <Image source={{ uri: avion.foto_url }} style={styles.cardImg} resizeMode="cover" />
                ) : (
                  <View style={styles.cardImgPlaceholder}>
                    <Ionicons name="airplane-outline" size={32} color="rgba(201,168,76,0.3)" />
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardMatricula}>{avion.matricula}</Text>
                  <Text style={styles.cardModelo}>{avion.modelo}</Text>
                  <Text style={styles.cardTipo}>{avion.tipo}</Text>
                  <View style={styles.cardSpecs}>
                    <View style={styles.cardSpec}>
                      <Ionicons name="people-outline" size={12} color="#C9A84C" />
                      <Text style={styles.cardSpecText}>{avion.pasajeros} pax</Text>
                    </View>
                    <View style={styles.cardSpec}>
                      <Ionicons name="time-outline" size={12} color="#C9A84C" />
                      <Text style={styles.cardSpecText}>{avion.horas_max}</Text>
                    </View>
                    {avion.wc && (
                      <View style={styles.cardSpec}>
                        <Ionicons name="checkmark-circle-outline" size={12} color="#C9A84C" />
                        <Text style={styles.cardSpecText}>WC</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(201,168,76,0.5)" />
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
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.15)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 14, color: '#fff', fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  heroSection: { padding: 24, paddingBottom: 20 },
  heroTag: { fontSize: 9, color: '#C9A84C', letterSpacing: 4, marginBottom: 8 },
  heroTitle: { fontSize: 26, color: '#fff', fontWeight: '300', lineHeight: 32 },
  heroGold: { color: '#C9A84C', fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginHorizontal: 24, marginBottom: 20 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyBox: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 16, padding: 14, marginBottom: 12,
  },
  cardImg: { width: 80, height: 70, borderRadius: 10 },
  cardImgPlaceholder: {
    width: 80, height: 70, borderRadius: 10,
    backgroundColor: 'rgba(201,168,76,0.05)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.1)',
  },
  cardInfo: { flex: 1 },
  cardMatricula: { fontSize: 10, color: '#C9A84C', letterSpacing: 2, marginBottom: 2 },
  cardModelo: { fontSize: 16, color: '#fff', fontWeight: '500', marginBottom: 2 },
  cardTipo: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
  cardSpecs: { flexDirection: 'row', gap: 10 },
  cardSpec: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardSpecText: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  detailImg: { width: '100%', height: 240 },
  detailImgPlaceholder: {
    width: '100%', height: 240,
    backgroundColor: 'rgba(201,168,76,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  detailContent: { padding: 24 },
  detailMatricula: { fontSize: 11, color: '#C9A84C', letterSpacing: 3, marginBottom: 4 },
  detailModelo: { fontSize: 28, color: '#fff', fontWeight: '300', marginBottom: 4 },
  detailTipo: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  specItem: { alignItems: 'center', width: '22%', gap: 6 },
  specValue: { fontSize: 18, color: '#fff', fontWeight: '500' },
  specLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },
  featuresRow: { flexDirection: 'row', gap: 12 },
  featureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 10, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  featureBadgeActive: {
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderColor: 'rgba(201,168,76,0.2)',
  },
  featureText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  featureTextActive: { color: 'rgba(255,255,255,0.7)' },
});