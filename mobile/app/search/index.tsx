import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Input } from '../../src/components/Input';
import { RouteCard } from '../../src/components/RouteCard';
import { StopCard } from '../../src/components/StopCard';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('recentSearches');
      if (raw) setRecent(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!debounced) { setRoutes([]); setStops([]); return; }
      try {
        const res = await api.get('/search', { params: { q: debounced } });
        if (!active) return;
        setRoutes(res.data.data.routes);
        setStops(res.data.data.stops);
      } catch {}
    })();
    return () => { active = false; };
  }, [debounced]);

  async function commitToRecent(text: string) {
    const next = [text, ...recent.filter((r) => r !== text)].slice(0, 8);
    setRecent(next);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(next));
  }

  async function clearHistory() {
    setRecent([]);
    await AsyncStorage.removeItem('recentSearches');
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Search' }} />
      <Input
        placeholder="Search routes, stops, destinations"
        value={q}
        onChangeText={setQ}
        onSubmitEditing={() => q.trim() && commitToRecent(q.trim())}
      />
      <ScrollView>
        {!debounced ? (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>Recent</Text>
              {recent.length > 0 && (
                <Text onPress={clearHistory} style={{ color: colors.error, fontWeight: '600' }}>Clear</Text>
              )}
            </View>
            {recent.map((r) => (
              <Text key={r} onPress={() => setQ(r)} style={{ color: colors.textMuted, paddingVertical: 8 }}>{r}</Text>
            ))}
          </View>
        ) : (
          <>
            <Text style={[styles.h2, { color: colors.text }]}>Routes</Text>
            {routes.length === 0 ? <Text style={{ color: colors.textMuted }}>No routes.</Text> :
              routes.map((r) => <RouteCard key={r.id} route={r} onPress={() => { commitToRecent(debounced); router.push(`/route/${r.id}`); }} />)}
            <Text style={[styles.h2, { color: colors.text }]}>Stops</Text>
            {stops.length === 0 ? <Text style={{ color: colors.textMuted }}>No stops.</Text> :
              stops.map((s) => <StopCard key={s.id} stop={s} onPress={() => router.push(`/stop/${s.id}`)} />)}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  h2: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
});