import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ImageBackground, Linking, Modal, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { supabase } from '../../lib/supabase';

type Notificacion = {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
};

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const fetchNotificaciones = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setNotificaciones(data);
  };

  const marcarLeidas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('usuario_id', user.id)
      .eq('leida', false);
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotificaciones();
    }, [])
  );

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const handleLogout = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const menuItems = [
    { label: 'Inicio', icon: 'home-outline', onPress: () => { setMenuOpen(false); } },
    { label: 'Empty Legs', icon: 'airplane-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/empty-legs'); } },
    { label: 'Charter Privado', icon: 'paper-plane-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/charters'); } },
    { label: 'Mis Viajes', icon: 'briefcase-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/viajes'); } },
    { label: 'Nuestra Flota', icon: 'albums-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/flota'); } },
    { label: 'Membresías', icon: 'star-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/membresias'); } },
    { label: 'Quiénes somos', icon: 'information-circle-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/quienes'); } },
    { label: 'Mi Perfil', icon: 'person-outline', onPress: () => { setMenuOpen(false); router.push('/(tabs)/perfil'); } },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <Modal visible={notiOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setNotiOpen(false)} activeOpacity={1}>
          <View style={styles.notiPanel}>
            <View style={styles.notiHeader}>
              <Text style={styles.notiTitle}>Notificaciones</Text>
              <TouchableOpacity onPress={() => setNotiOpen(false)}>
                <Ionicons name="close" size={20} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>
            <View style={styles.goldLine} />
            <ScrollView>
              {notificaciones.length === 0 ? (
                <View style={styles.notiEmpty}>
                  <Ionicons name="notifications-off-outline" size={32} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.notiEmptyText}>Sin notificaciones</Text>
                </View>
              ) : (
                notificaciones.map(n => (
                  <View key={n.id} style={[styles.notiItem, !n.leida && styles.notiItemUnread]}>
                    <View style={styles.notiItemLeft}>
                      {!n.leida && <View style={styles.notiDot} />}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notiItemTitle}>{n.titulo}</Text>
                        <Text style={styles.notiItemMsg}>{n.mensaje}</Text>
                        <Text style={styles.notiItemTime}>
                          {new Date(n.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={menuOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuOpen(false)} activeOpacity={1}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarLogo}>Patriot</Text>
              <Text style={styles.sidebarLogoSub}>AVIATION</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>
            <View style={styles.goldLine} />
            <ScrollView style={styles.menuList}>
              {menuItems.map((item, i) => (
                <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
                  <Ionicons name={item.icon as any} size={20} color="#C9A84C" style={{ width: 28 }} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    setNotiOpen(true);
                    marcarLeidas();
                  }, 300);
                }}
              >
                <View style={{ width: 28, position: 'relative' }}>
                  <Ionicons name="notifications-outline" size={20} color="#C9A84C" />
                  {noLeidas > 0 && <View style={styles.badge} />}
                </View>
                <Text style={styles.menuLabel}>Notificaciones</Text>
                {noLeidas > 0 && (
                  <View style={styles.badgeCount}>
                    <Text style={styles.badgeCountText}>{noLeidas}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.privacidadBtn}
              onPress={() => { setMenuOpen(false); Linking.openURL('https://patriot-admin.vercel.app/privacidad'); }}
            >
              <Text style={styles.privacidadText}>Aviso de Privacidad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutMenuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={16} color="rgba(255,255,255,0.25)" />
              <Text style={styles.logoutMenuText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView>
        <ImageBackground
          source={require('../../assets/images/login-bg.png')}
          style={styles.heroBg}
          resizeMode="cover"
        >
          <View style={styles.darkOverlay} />
          <LinearGradient
            colors={['transparent', 'transparent', '#0D1B2A']}
            style={styles.heroGradient}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.logo}>Patriot</Text>
                <Text style={styles.logoSub}>AVIATION</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.instagram.com/patriot.aviation')}
                  style={styles.igBtn}
                >
                  <Ionicons name="logo-instagram" size={22} color="#C9A84C" />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.hamburger}>
                  <View style={styles.bar} />
                  <View style={styles.bar} />
                  <View style={styles.bar} />
                  {noLeidas > 0 && <View style={styles.hamburgerBadge} />}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroSub}>BIENVENIDO</Text>
              <Text style={styles.heroTitle}>Selecciona tu</Text>
              <Text style={styles.heroItalic}>forma de volar</Text>
              <Text style={styles.heroCopy}>Experiencia ejecutiva de primer nivel · Toluca</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.cards}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/empty-legs')}>
            <Text style={styles.cardTag}>EMPTY LEGS</Text>
            <Text style={styles.cardTitle}>Vuelos disponibles</Text>
            <Text style={styles.cardDesc}>Asientos a precio especial en rutas confirmadas.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/charters')}>
            <Text style={styles.cardTag}>CHARTER</Text>
            <Text style={styles.cardTitle}>Vuelo privado</Text>
            <Text style={styles.cardDesc}>Tu avión, tu ruta, tu horario.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/membresias')}>
            <Text style={styles.cardTag}>MEMBRESÍAS</Text>
            <Text style={styles.cardTitle}>Planes Blue y Black</Text>
            <Text style={styles.cardDesc}>Acceso preferencial y beneficios exclusivos.</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  heroBg: { width: '100%' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  heroGradient: { paddingBottom: 32 },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 28, color: '#fff', fontWeight: '300', letterSpacing: 4 },
  logoSub: { fontSize: 10, color: '#C9A84C', letterSpacing: 6 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  igBtn: { padding: 8 },
  separator: { width: 1, height: 20, backgroundColor: 'rgba(201,168,76,0.4)', marginHorizontal: 4 },
  hamburger: { padding: 8, justifyContent: 'center', position: 'relative' },
  bar: { width: 22, height: 2, backgroundColor: '#C9A84C', borderRadius: 2, marginVertical: 2 },
  hamburgerBadge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', borderWidth: 1, borderColor: '#0D1B2A' },
  heroText: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 16 },
  heroSub: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 8 },
  heroTitle: { fontSize: 40, color: '#fff', fontWeight: '300' },
  heroItalic: { fontSize: 40, color: '#C9A84C', fontStyle: 'italic', fontWeight: '300', marginTop: -8 },
  heroCopy: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 12 },
  cards: { paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', borderRadius: 16, padding: 20 },
  cardTag: { fontSize: 9, color: '#C9A84C', letterSpacing: 3, marginBottom: 6 },
  cardTitle: { fontSize: 18, color: '#fff', fontWeight: '500', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row' },
  sidebar: { width: '75%', backgroundColor: '#0D1B2A', borderRightWidth: 1, borderRightColor: 'rgba(201,168,76,0.2)', paddingTop: 60 },
  sidebarHeader: { paddingHorizontal: 24, paddingBottom: 20, position: 'relative' },
  sidebarLogo: { fontSize: 28, color: '#fff', fontWeight: '300', letterSpacing: 4 },
  sidebarLogoSub: { fontSize: 10, color: '#C9A84C', letterSpacing: 6 },
  closeBtn: { position: 'absolute', top: 0, right: 24, padding: 8 },
  goldLine: { height: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginHorizontal: 24, marginBottom: 16 },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, gap: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  menuLabel: { fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: '300', letterSpacing: 1, flex: 1 },
  badge: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', borderWidth: 1, borderColor: '#0D1B2A' },
  badgeCount: { backgroundColor: '#4CAF50', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeCountText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  privacidadBtn: { paddingVertical: 12, alignItems: 'center' },
  privacidadText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: 1 },
  logoutMenuItem: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  logoutMenuText: { color: 'rgba(255,255,255,0.25)', fontSize: 13 },
  notiPanel: { width: '75%', backgroundColor: '#0D1B2A', borderRightWidth: 1, borderRightColor: 'rgba(201,168,76,0.2)', paddingTop: 60, maxHeight: '100%' },
  notiHeader: { paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notiTitle: { fontSize: 20, color: '#fff', fontWeight: '300', letterSpacing: 2 },
  notiEmpty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  notiEmptyText: { color: 'rgba(255,255,255,0.2)', fontSize: 13 },
  notiItem: { paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  notiItemUnread: { backgroundColor: 'rgba(201,168,76,0.04)' },
  notiItemLeft: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  notiDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginTop: 4 },
  notiItemTitle: { fontSize: 14, color: '#fff', fontWeight: '500', marginBottom: 4 },
  notiItemMsg: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  notiItemTime: { fontSize: 10, color: 'rgba(255,255,255,0.2)' },
});
