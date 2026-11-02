import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Input } from '../../src/components/Input';
import { RouteCard } from '../../src/components/RouteCard';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { EmptyState } from '../../src/components/EmptyState';
import { ErrorState } from '../../src/components/ErrorState';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

const types = ['ALL', 'BUS', 'METRO', 'TRAIN', 'TRAM', 'FERRY'];

export default function RoutesList() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'routeNumber' | 'routeName' | 'estimatedDuration'>('routeNumber');

  const params = useMemo(() => ({
    search: search.trim() || undefined,
    transportType: type === 'ALL' ? undefined : type,
    page,
    limit: 10,
    sort,
  }), [search, type, page, sort]);

  const query = useQuery({ queryKey: ['routes', params], queryFn: async () => (await api.get('/routes', { params })).data });

  return (
    <ScreenContainer>
      <Input placeholder="Search routes" value={search} onChangeText={(t) => { setSearch(t); setPage(1); }} />

      <View style={styles.filters}>
        {types.map((t) => (
          <Pressable
            key={t}
            onPress={() => { setType(t); setPage(1); }}
            style={[styles.chip, {
              backgroundColor: type === t ? colors.primary : colors.surface,
              borderColor: colors.border,
            }]}
          >
            <Text style={{ color: type === t ? '#fff' : colors.text, fontSize: 12, fontWeight: '600' }}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sorts}>
        {(['routeNumber', 'routeName', 'estimatedDuration'] as const).map((s) => (
          <Pressable key={s} onPress={() => setSort(s)}>
            <Text style={{ color: sort === s ? colors.primary : colors.textMuted, fontWeight: '600', fontSize: 12 }}>{s}</Text>
          </Pressable>
        ))}
      </View>

      {query.isLoading ? (
        <LoadingIndicator />
      ) : query.isError ? (
        <ErrorState message="Could not load routes." onRetry={() => query.refetch()} />
      ) : (
        <FlatList
          data={query.data?.data ?? []}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <RouteCard route={item} onPress={() => router.push(`/route/${item.id}`)} />
          )}
          ListEmptyComponent={<EmptyState title="No routes found" message="Try a different search or filter." />}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (query.data?.meta && page < query.data.meta.totalPages) setPage((p) => p + 1);
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  sorts: { flexDirection: 'row', gap: 16, marginBottom: 12 },
});