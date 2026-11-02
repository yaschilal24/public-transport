import React from 'react';
import { FlatList, Text, View, Pressable, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function Notifications() {
  const { colors } = useTheme();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['notifications'], queryFn: async () => (await api.get('/notifications')).data.data });

  const markAll = useMutation({
    mutationFn: async () => { await api.patch('/notifications/read-all'); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const markOne = useMutation({
    mutationFn: async (id: string) => { await api.patch(`/notifications/${id}/read`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Notifications' }} />
      <Button title="Mark all as read" variant="outline" onPress={() => markAll.mutate()} />
      <View style={{ height: 12 }} />
      {q.isLoading ? <LoadingIndicator /> : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(n: any) => n.id}
          refreshing={q.isFetching}
          onRefresh={() => q.refetch()}
          ListEmptyComponent={<EmptyState title="No notifications" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => !item.isRead && markOne.mutate(item.id)}
              style={[styles.item, { borderColor: colors.border, backgroundColor: item.isRead ? colors.surface : colors.background }]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
                {!item.isRead ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 }} /> : null}
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.message}</Text>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  item: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
});