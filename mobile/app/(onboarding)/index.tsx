import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Bus, MapPin, Map, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components/Button';

const slides = [
  { Icon: Bus, title: 'Search routes', text: 'Find the right bus, metro or tram by number, name or destination.' },
  { Icon: MapPin, title: 'Nearby stops', text: 'Discover stops close to you using your device location.' },
  { Icon: Map, title: 'Explore the map', text: 'See stops and routes on an interactive map.' },
  { Icon: Bell, title: 'Live alerts', text: 'Receive service alerts and updates that matter to you.' },
];

export default function Onboarding() {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  async function finish() {
    await AsyncStorage.setItem('onboarded', 'true');
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <Pressable onPress={finish}><Text style={{ color: colors.textMuted }}>Skip</Text></Pressable>
      </View>
      <View style={styles.center}>
        <slide.Icon color={colors.primary} size={96} />
        <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>{slide.text}</Text>
      </View>
      <View style={styles.bottom}>
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === index ? colors.primary : colors.border }]} />
          ))}
        </View>
        {index < slides.length - 1 ? (
          <Button title="Next" onPress={() => setIndex(index + 1)} />
        ) : (
          <Button title="Get Started" onPress={finish} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 24 },
  top: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  text: { fontSize: 15, textAlign: 'center', paddingHorizontal: 24 },
  bottom: { paddingBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});