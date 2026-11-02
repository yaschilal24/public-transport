// mobile/app/reports/[id].tsx
import React from 'react';
import { Text, View, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { StatusBadge } from '../../src/components/StatusBadge';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function ReportDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const q = useQuery({ queryKey: ['report', id], queryFn: async () => (await api.get(`/reports/${id}`)).data.data, enabled: !!id });

  if (q.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;
  if (!q.data) return <ScreenContainer><Text style={{ color: colors.text }}>Not found</Text></ScreenContainer>;
  const r = q.data;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Report' }} />
      <View style={{ gap: 8, marginTop: 8 }}>
        <StatusBadge status={r.status} />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{r.category.replace('_', ' ')}</Text>
        <Text style={{ color: colors.textMuted }}>{r.description}</Text>
        {r.route ? <Text style={{ color: colors.primary }}>Route {r.route.routeNumber}</Text> : null}
        {r.stop ? <Text style={{ color: colors.primary }}>Stop {r.stop.stopName}</Text> : null}
        {r.imageUrl ? <Image source={{ uri: r.imageUrl }} style={{ width: '100%', height: 220, borderRadius: 12, marginTop: 8 }} /> : null}
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>Submitted {new Date(r.createdAt).toLocaleString()}</Text>
      </View>
    </ScreenContainer>
  );
}