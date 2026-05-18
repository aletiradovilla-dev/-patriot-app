import { router } from 'expo-router';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Patriot</Text>
          <Text style={styles.logoSub}>AVIATION</Text>
        </View>

        {/* Welcome */}
        <View style={styles.hero}>
          <Text style={styles.heroSub}>BIENVENIDO</Text>
          <Text style={styles.heroTitle}>Select your</Text>
          <Text style={styles.heroItalic}>way to fly</Text>
          <Text style={styles.heroCopy}>Premier executive experience · Toluca</Text>
        </View>

        {/* Cards */}
        <View style={styles.cards}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTag}>EMPTY LEGS</Text>
            <Text style={styles.cardTitle}>Vuelos disponibles</Text>
            <Text style={styles.cardDesc}>Asientos a precio especial en rutas confirmadas.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTag}>CHARTER</Text>
            <Text style={styles.cardTitle}>Vuelo privado</Text>
            <Text style={styles.cardDesc}>Tu avión, tu ruta, tu horario.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTag}>MEMBRESÍAS</Text>
            <Text style={styles.cardTitle}>Planes Blue y Black</Text>
            <Text style={styles.cardDesc}>Acceso preferencial y beneficios exclusivos.</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  logo: { fontSize: 28, color: '#fff', fontWeight: '300', letterSpacing: 4 },
  logoSub: { fontSize: 10, color: '#C9A84C', letterSpacing: 6 },
  hero: { paddingHorizontal: 24, paddingVertical: 32 },
  heroSub: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 8 },
  heroTitle: { fontSize: 40, color: '#fff', fontWeight: '300' },
  heroItalic: { fontSize: 40, color: '#C9A84C', fontStyle: 'italic', fontWeight: '300', marginTop: -8 },
  heroCopy: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 12 },
  cards: { paddingHorizontal: 24, gap: 12 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', borderRadius: 16, padding: 20 },
  cardTag: { fontSize: 9, color: '#C9A84C', letterSpacing: 3, marginBottom: 6 },
  cardTitle: { fontSize: 18, color: '#fff', fontWeight: '500', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  logoutBtn: { margin: 24, padding: 16, alignItems: 'center' },
  logoutText: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
});