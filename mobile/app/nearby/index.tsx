import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { StopCard } from '../../src/components/StopCard';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function Nearby() {
  const { colors } = useTheme();
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') { setError('Location permission denied. You can still search stops manually.'); setLoading(false); return; }
      const pos = await Location.getCurrentPositionAsync({});
      const res = await api.get('/stops/nearby', { params: { lat: pos.coords.latitude, lng: pos.coords.longitude, radius: 3 } });
      setStops(res.data.data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Nearby stops' }} />
      {loading ? <LoadingIndicator /> :
        error ? (
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.error, marginBottom: 12 }}>{error}</Text>
            <Button title="Retry" onPress={load} />
            <View style={{ height: 12 }} />
            <Button title="Search stops manually" variant="outline" onPress={() => router.push('/search')} />
          </View>
        ) : (
          <FlatList
            data={stops}
            keyExtractor={(s: any) => s.id}
            renderItem={({ item }) => (
              <StopCard stop={item} distanceKm={item.distanceKm} onPress={() => router.push(`/stop/${item.id}`)} />
            )}
            ListEmptyComponent={<Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 32 }}>No stops nearby.</Text>}
            refreshing={loading}
            onRefresh={load}
          />
        )}
    </ScreenContainer>
  );
}