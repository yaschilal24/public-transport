// mobile/app/reports/index.tsx
import React from 'react';
import { FlatList, Text, View, Pressable, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { EmptyState } from '../../src/components/EmptyState';
import { StatusBadge } from '../../src/components/StatusBadge';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function ReportsList() {
  const { colors } = useTheme();
  const q = useQuery({ queryKey: ['reports'], queryFn: async () => (await api.get('/reports')).data.data });

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'My reports' }} />
      <Button title="New report" onPress={() => router.push('/reports/create')} />
      <View style={{ height: 12 }} />
      {q.isLoading ? <LoadingIndicator /> : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(r: any) => r.id}
          refreshing={q.isFetching}
          onRefresh={() => q.refetch()}
          ListEmptyComponent={<EmptyState title="No reports yet" message="Submit a report if you notice a problem." />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/reports/${item.id}`)}
              style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>{item.category.replace('_', ' ')}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text numberOfLines={2} style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>{item.description}</Text>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
});