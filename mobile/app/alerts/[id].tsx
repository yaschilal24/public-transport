// mobile/app/alerts/[id].tsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { StatusBadge } from '../../src/components/StatusBadge';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function AlertDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const q = useQuery({ queryKey: ['alert', id], queryFn: async () => (await api.get(`/alerts/${id}`)).data.data, enabled: !!id });

  if (q.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;
  if (!q.data) return <ScreenContainer><Text style={{ color: colors.text }}>Not found</Text></ScreenContainer>;

  const a = q.data;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Alert' }} />
      <View style={{ gap: 8, marginTop: 8 }}>
        <StatusBadge status={a.severity} />
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>{a.title}</Text>
        <Text style={{ color: colors.textMuted }}>{a.description}</Text>
        {a.route ? <Text style={{ color: colors.primary }}>Route {a.route.routeNumber} — {a.route.routeName}</Text> : null}
        {a.stop ? <Text style={{ color: colors.primary }}>Stop {a.stop.stopName}</Text> : null}
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 12 }}>
          {new Date(a.startDate).toLocaleString()}
          {a.expirationDate ? ` → ${new Date(a.expirationDate).toLocaleString()}` : ''}
        </Text>
      </View>
    </ScreenContainer>
  );
}