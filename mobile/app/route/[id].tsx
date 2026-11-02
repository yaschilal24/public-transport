import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Map, Clock, AlertCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { ErrorState } from '../../src/components/ErrorState';
import { StatusBadge } from '../../src/components/StatusBadge';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function RouteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['route', id],
    queryFn: async () => (await api.get(`/routes/${id}`)).data.data,
    enabled: !!id,
  });

  const favQ = useQuery({ queryKey: ['favorites'], queryFn: async () => (await api.get('/favorites')).data.data });
  const isFavorite = (favQ.data ?? []).some((f: any) => f.routeId === id);

  const addFav = useMutation({
    mutationFn: async () => { await api.post('/favorites', { routeId: id }); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
  const removeFav = useMutation({
    mutationFn: async () => { await api.delete(`/favorites/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });

  if (query.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;
  if (query.isError || !query.data) return <ScreenContainer><ErrorState message="Could not load route." onRetry={() => query.refetch()} /></ScreenContainer>;

  const route = query.data;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: `Route ${route.routeNumber}` }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.num, { color: colors.primary }]}>{route.routeNumber}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{route.routeName}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>{route.startLocation} → {route.endLocation}</Text>
          </View>
          <Pressable onPress={() => isFavorite ? removeFav.mutate() : addFav.mutate()} hitSlop={12}>
            <Heart color={isFavorite ? colors.error : colors.textMuted} fill={isFavorite ? colors.error : 'transparent'} size={26} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Clock color={colors.primary} size={18} />
            <Text style={{ color: colors.text, marginTop: 4, fontSize: 13 }}>{route.estimatedDuration} min</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{route.transportType}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Type</Text>
          </View>
          <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <StatusBadge status={route.status} />
          </View>
        </View>

        <Text style={[styles.h2, { color: colors.text }]}>Stops</Text>
        {route.routeStops.map((rs: any, idx: number) => (
          <Pressable
            key={rs.id}
            onPress={() => router.push(`/stop/${rs.stopId}`)}
            style={[styles.stopRow, { borderColor: colors.border }]}
          >
            <View style={[styles.dot, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{idx + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{rs.stop.stopName}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{rs.stop.address ?? ''}</Text>
            </View>
          </Pressable>
        ))}

        <Text style={[styles.h2, { color: colors.text }]}>Schedules (demonstration)</Text>
        {route.schedules.map((s: any) => (
          <Pressable
            key={s.id}
            onPress={() => router.push(`/schedule/${s.id}`)}
            style={[styles.schedule, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>{s.departureTime} → {s.arrivalTime}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{s.operatingDays}{s.frequency ? ` · every ${s.frequency} min` : ''}</Text>
          </Pressable>
        ))}

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Button title="View on map" variant="outline" onPress={() => router.push('/(tabs)/map')} style={{ flex: 1 }} />
          <Button title="Report issue" variant="secondary" onPress={() => router.push({ pathname: '/reports/create', params: { routeId: id } })} style={{ flex: 1 }} />
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  num: { fontSize: 14, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, padding: 10, minHeight: 60 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  dot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  schedule: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
});