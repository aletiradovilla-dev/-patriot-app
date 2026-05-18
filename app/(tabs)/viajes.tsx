import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ViajesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.tag}>MIS VIAJES</Text>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.sub}>Próximamente</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tag: { fontSize: 10, color: '#C9A84C', letterSpacing: 4, marginBottom: 8 },
  title: { fontSize: 28, color: '#fff', fontWeight: '300' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 8 },
});