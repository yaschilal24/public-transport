import React from 'react';
import { FlatList } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { RouteCard } from '../../src/components/RouteCard';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { EmptyState } from '../../src/components/EmptyState';
import { api } from '../../src/services/api';

export default function FavoritesScreen() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['favorites'], queryFn: async () => (await api.get('/favorites')).data.data });

  const remove = useMutation({
    mutationFn: async (routeId: string) => { await api.delete(`/favorites/${routeId}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });

  if (query.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;

  return (
    <ScreenContainer>
      <FlatList
        data={query.data ?? []}
        keyExtractor={(item: any) => item.id}
        refreshing={query.isFetching}
        onRefresh={() => query.refetch()}
        ListEmptyComponent={<EmptyState title="No favorites yet" message="Add routes you use often to find them here." />}
        renderItem={({ item }) => (
          <RouteCard
            route={item.route}
            isFavorite
            onFavoriteToggle={() => remove.mutate(item.routeId)}
            onPress={() => router.push(`/route/${item.routeId}`)}
          />
        )}
      />
    </ScreenContainer>
  );
}