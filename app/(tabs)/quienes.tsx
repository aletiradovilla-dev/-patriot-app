import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const razones = [
  { icon: 'checkmark-circle-outline', texto: 'Certificación AOC y operación regulada' },
  { icon: 'shield-checkmark-outline', texto: 'Altos estándares de seguridad' },
  { icon: 'person-outline', texto: 'Atención personalizada, discreta y confiable' },
  { icon: 'time-outline', texto: 'Puntualidad respaldada por procesos precisos' },
  { icon: 'home-outline', texto: 'FBO privado con acceso exclusivo' },
  { icon: 'star-outline', texto: 'Más de 20 años de experiencia en aviación ejecutiva' },
];

export default function QuienesSomosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiénes Somos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>NUESTRA HISTORIA</Text>
          <Text style={styles.heroTitle}>Dos décadas de{'\n'}experiencia y <Text style={styles.heroItalic}>confianza.</Text></Text>
        </View>

        <View style={styles.divider} />

        {/* MISIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NUESTRA MISIÓN</Text>
          <Text style={styles.sectionTitle}>Conectamos lo que <Text style={styles.gold}>realmente importa</Text></Text>

          {/* FOTO FAMILIA */}
          <Image
            source={require('../../assets/images/familia.png')}
            style={styles.familiaImg}
            resizeMode="cover"
          />

          <Text style={styles.body}>
            En Patriot, volamos para acercar personas y oportunidades. Con más de 20 años de experiencia familiar, ofrecemos una operación segura, puntual y cuidada en cada detalle.
          </Text>
          <Text style={styles.body}>
            Como empresa familiar, entendemos que detrás de cada vuelo hay un motivo que importa. Esa sensibilidad define nuestra forma de operar.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* LIDERAZGO */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LIDERAZGO</Text>
          <View style={styles.leaderCard}>
            <Image
              source={require('../../assets/images/juan-pablo.jpg')}
              style={styles.leaderPhoto}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.leaderName}>Juan Pablo Morales</Text>
              <Text style={styles.leaderTitle}>FOUNDER & CEO</Text>
              <Text style={styles.leaderBio}>
                Experiencia técnica con servicio genuino y discreto. Nos anticipamos a las necesidades de cada pasajero.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* POR QUÉ ELEGIRNOS */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={styles.sectionLabel}>RAZONES PARA ELEGIRNOS</Text>
          <Text style={styles.sectionTitle}>¿Por qué <Text style={styles.gold}>Patriot?</Text></Text>
          {razones.map((r, i) => (
            <View key={i} style={styles.razonRow}>
              <View style={styles.razonIcon}>
                <Ionicons name={r.icon as any} size={18} color="#C9A84C" />
              </View>
              <Text style={styles.razonText}>{r.texto}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => Linking.openURL('https://wa.me/527225592758?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20Patriot%20Aviation.')}
          >
            <Ionicons name="logo-whatsapp" size={18} color="white" />
            <Text style={styles.ctaText}>Contáctanos por WhatsApp</Text>
          </TouchableOpacity>
        </View>

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
  scroll: { paddingBottom: 20 },
  hero: { padding: 28, paddingBottom: 24 },
  heroTag: { fontSize: 9, color: '#C9A84C', letterSpacing: 4, marginBottom: 10 },
  heroTitle: { fontSize: 28, color: '#fff', fontWeight: '300', lineHeight: 36 },
  heroItalic: { fontStyle: 'italic', color: '#C9A84C' },
  divider: { height: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginHorizontal: 28 },
  section: { padding: 28, paddingBottom: 24 },
  sectionLabel: { fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 10 },
  sectionTitle: { fontSize: 22, color: '#fff', fontWeight: '300', marginBottom: 16, lineHeight: 28 },
  gold: { color: '#C9A84C', fontStyle: 'italic' },
  body: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 22, marginBottom: 12 },
  familiaImg: {
    width: '100%', height: 220, borderRadius: 16,
    marginBottom: 16, borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)',
  },
  leaderCard: {
    flexDirection: 'row', gap: 16, alignItems: 'flex-start',
    padding: 18, marginTop: 12,
    backgroundColor: 'rgba(201,168,76,0.05)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)',
  },
  leaderPhoto: {
    width: 80, height: 100, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)', flexShrink: 0,
  },
  leaderName: { fontSize: 17, color: '#fff', fontWeight: '600', marginBottom: 3 },
  leaderTitle: { fontSize: 9, color: '#C9A84C', letterSpacing: 2, marginBottom: 8 },
  leaderBio: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },
  razonRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  razonIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  razonText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', flex: 1 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: 16, borderRadius: 14,
    backgroundColor: '#128C7E', marginTop: 24,
  },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});