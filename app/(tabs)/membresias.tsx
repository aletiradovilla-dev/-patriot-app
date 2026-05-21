import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfile } from '../../hooks/useProfile';

const WHATSAPP_NUMBER = '527225592758';

const beneficiosBlue = [
  'Acceso ilimitado a Empty Legs nacionales',
  'Hasta 1 pasajero por vuelo',
  'Notificación prioritaria de vuelos',
  'Soporte y atención por WhatsApp',
  'Tarifas preferenciales en vuelos compartidos',
];

const beneficiosBlack = [
  'Acceso ilimitado a Empty Legs nacionales e internacionales',
  'Hasta 2 pasajeros por vuelo',
  'Notificación prioritaria de vuelos',
  'Soporte y atención por WhatsApp',
  'Tarifas preferenciales en vuelos compartidos',
];

function PlanCard({ plan, profile }: { plan: 'blue' | 'black'; profile: any }) {
  const isBlack = plan === 'black';

  const handleWhatsApp = () => {
    const msg = isBlack
      ? `✈️ *Membresía Patriot Black - Patriot Aviation*\n\n*Cliente:* ${profile.nombre || 'No registrado'}\n*Email:* ${profile.email}\n*Teléfono:* ${profile.telefono || 'No registrado'}\n*Plan:* Patriot Black ($22,000 MXN/mes)\n\n_Me interesa este plan._`
      : `✈️ *Membresía Patriot Blue - Patriot Aviation*\n\n*Cliente:* ${profile.nombre || 'No registrado'}\n*Email:* ${profile.email}\n*Teléfono:* ${profile.telefono || 'No registrado'}\n*Plan:* Patriot Blue ($9,900 MXN/mes)\n\n_Me interesa este plan._`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={[styles.card, isBlack ? styles.cardBlack : styles.cardBlue]}>
      {isBlack && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>★ PREMIUM</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, isBlack ? styles.iconBoxBlack : styles.iconBoxBlue]}>
          <Ionicons
            name={isBlack ? 'diamond-outline' : 'airplane-outline'}
            size={24}
            color={isBlack ? '#e5c97e' : '#93c5fd'}
          />
        </View>
        <View>
          <Text style={[styles.planName, isBlack ? styles.planNameBlack : styles.planNameBlue]}>
            {isBlack ? 'Patriot Black' : 'Patriot Blue'}
          </Text>
          <Text style={styles.planSub}>
            {isBlack ? 'Nacional + Internacional' : 'Vuelos Nacionales'}
          </Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.price, isBlack ? styles.priceBlack : styles.priceBlue]}>
          ${isBlack ? '22,000' : '9,900'}
        </Text>
        <Text style={styles.priceSub}> MXN / mes</Text>
      </View>
      <Text style={styles.priceNote}>
        {isBlack ? 'IVA incluido' : 'IVA incluido'}
      </Text>

      <View style={[styles.divider, isBlack ? styles.dividerBlack : styles.dividerBlue]} />

      <Text style={styles.beneficiosLabel}>INCLUYE</Text>
      {(isBlack ? beneficiosBlack : beneficiosBlue).map((b, i) => (
        <View key={i} style={styles.beneficioRow}>
          <View style={[styles.checkBox, isBlack ? styles.checkBoxBlack : styles.checkBoxBlue]}>
            <Ionicons name="checkmark" size={10} color={isBlack ? '#e5c97e' : '#93c5fd'} />
          </View>
          <Text style={styles.beneficioText}>{b}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.btn, isBlack ? styles.btnBlack : styles.btnBlue]}
        onPress={handleWhatsApp}
      >
        <Ionicons name="logo-whatsapp" size={18} color="white" />
        <Text style={styles.btnText}>Quiero este plan</Text>
      </TouchableOpacity>

      <Text style={styles.cancelNote}>Cancela en cualquier momento</Text>
    </View>
  );
}

export default function MembresiasScreen() {
  const profile = useProfile();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membresías</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.heroTag}>NUESTROS PLANES</Text>
          <Text style={styles.heroTitle}>Descubre el plan{'\n'}hecho para ti</Text>
          <Text style={styles.heroCopy}>
            Selecciona tu membresía ideal
          </Text>
        </View>

        <PlanCard plan="blue" profile={profile} />
        <PlanCard plan="black" profile={profile} />

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scroll: { padding: 20 },
  hero: { alignItems: 'center', marginBottom: 28, paddingVertical: 12 },
  heroTag: { fontSize: 9, color: '#C9A84C', letterSpacing: 4, marginBottom: 10 },
  heroTitle: { fontSize: 30, color: '#fff', fontWeight: '300', textAlign: 'center', lineHeight: 36, marginBottom: 10 },
  heroCopy: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20 },
  card: { borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 1, position: 'relative' },
  cardBlue: { backgroundColor: '#0f1e35', borderColor: 'rgba(59,130,246,0.35)' },
  cardBlack: { backgroundColor: '#141414', borderColor: 'rgba(201,168,76,0.4)' },
  badge: {
    position: 'absolute', top: 18, right: 18,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
  },
  badgeText: { fontSize: 8, color: '#C9A84C', letterSpacing: 2, fontWeight: '700' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconBoxBlue: { backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' },
  iconBoxBlack: { backgroundColor: 'rgba(201,168,76,0.1)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)' },
  planName: { fontSize: 22, fontWeight: '600' },
  planNameBlue: { color: '#e0eaff' },
  planNameBlack: { color: '#f5e6c8' },
  planSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 40, fontWeight: '700' },
  priceBlue: { color: '#93c5fd' },
  priceBlack: { color: '#C9A84C' },
  priceSub: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  priceNote: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, marginBottom: 20 },
  divider: { height: 1, marginBottom: 16 },
  dividerBlue: { backgroundColor: 'rgba(59,130,246,0.2)' },
  dividerBlack: { backgroundColor: 'rgba(201,168,76,0.15)' },
  beneficiosLabel: { fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12 },
  beneficioRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  checkBox: { width: 18, height: 18, borderRadius: 5, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  checkBoxBlue: { backgroundColor: 'rgba(59,130,246,0.2)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.4)' },
  checkBoxBlack: { backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)' },
  beneficioText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20, flex: 1, textAlign: 'left' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, marginTop: 24 },
  btnBlue: { backgroundColor: '#128C7E' },
  btnBlack: { backgroundColor: '#128C7E' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  cancelNote: { textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 10 },
});