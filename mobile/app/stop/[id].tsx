import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { ErrorState } from '../../src/components/ErrorState';
import { RouteCard } from '../../src/components/RouteCard';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function StopDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const q = useQuery({ queryKey: ['stop', id], queryFn: async () => (await api.get(`/stops/${id}`)).data.data, enabled: !!id });

  if (q.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;
  if (q.isError || !q.data) return <ScreenContainer><ErrorState message="Could not load stop." onRetry={() => q.refetch()} /></ScreenContainer>;

  const stop = q.data;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: stop.stopName }} />
      <ScrollView>
        <Text style={[styles.title, { color: colors.text }]}>{stop.stopName}</Text>
        {stop.address ? <Text style={{ color: colors.textMuted, marginBottom: 8 }}>{stop.address}</Text> : null}
        {stop.description ? <Text style={{ color: colors.textMuted, marginBottom: 8 }}>{stop.description}</Text> : null}
        <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>
          Coordinates: {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>Routes serving this stop</Text>
        {stop.routeStops.map((rs: any) => (
          <RouteCard key={rs.id} route={rs.route} onPress={() => router.push(`/route/${rs.routeId}`)} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 12 },
});