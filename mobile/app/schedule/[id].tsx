import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function ScheduleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const q = useQuery({ queryKey: ['schedule', id], queryFn: async () => (await api.get(`/schedules/${id}`)).data.data, enabled: !!id });

  if (q.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;
  if (!q.data) return <ScreenContainer><Text style={{ color: colors.text }}>Not found</Text></ScreenContainer>;

  const s = q.data;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Schedule (demo)' }} />
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>Demonstration schedule</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>{s.route?.routeNumber} — {s.route?.routeName}</Text>
        <Text style={{ color: colors.text, marginTop: 8 }}>Departure: {s.departureTime}</Text>
        <Text style={{ color: colors.text }}>Arrival: {s.arrivalTime}</Text>
        <Text style={{ color: colors.text }}>Operating days: {s.operatingDays}</Text>
        {s.frequency ? <Text style={{ color: colors.text }}>Frequency: every {s.frequency} min</Text> : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 12 },
});