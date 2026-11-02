// mobile/app/alerts/index.tsx
import React from 'react';
import { FlatList, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { AlertCard } from '../../src/components/AlertCard';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { EmptyState } from '../../src/components/EmptyState';
import { api } from '../../src/services/api';

export default function AlertsList() {
  const q = useQuery({ queryKey: ['alerts'], queryFn: async () => (await api.get('/alerts')).data.data });

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Service alerts' }} />
      {q.isLoading ? <LoadingIndicator /> : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(a: any) => a.id}
          refreshing={q.isFetching}
          onRefresh={() => q.refetch()}
          ListEmptyComponent={<EmptyState title="No active alerts" message="You're all caught up." />}
          renderItem={({ item }) => <AlertCard alert={item} onPress={() => router.push(`/alerts/${item.id}`)} />}
        />
      )}
    </ScreenContainer>
  );
}