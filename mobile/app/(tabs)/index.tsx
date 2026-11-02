import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Search, MapPin, Map, Heart, Bell } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { RouteCard } from '../../src/components/RouteCard';
import { AlertCard } from '../../src/components/AlertCard';
import { OfflineBanner } from '../../src/components/OfflineBanner';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { useAuthStore } from '../../src/store/authStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function HomeScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);

  const routesQ = useQuery({ queryKey: ['home-routes'], queryFn: async () => (await api.get('/routes?limit=5')).data.data });
  const alertsQ = useQuery({ queryKey: ['home-alerts'], queryFn: async () => (await api.get('/alerts')).data.data });

  const actions = [
    { icon: Search, label: 'Find routes', to: '/search' },
    { icon: MapPin, label: 'Nearby stops', to: '/nearby' },
    { icon: Map, label: 'Explore map', to: '/(tabs)/map' },
    { icon: Heart, label: 'Favorites', to: '/(tabs)/favorites' },
  ];

  return (
    <ScreenContainer>
      <OfflineBanner />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Hello,</Text>
            <Text style={[styles.name, { color: colors.text }]}>{user?.fullName ?? 'Passenger'}</Text>
          </View>
          <Pressable onPress={() => router.push('/notifications')} hitSlop={12}>
            <Bell color={colors.text} size={24} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/search')}
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Search color={colors.textMuted} size={18} />
          <Text style={{ color: colors.textMuted, marginLeft: 8 }}>Where are you going?</Text>
        </Pressable>

        <SectionHeader title="Quick actions" />
        <View style={styles.actions}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.to as any)}
              style={[styles.action, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <a.icon color={colors.primary} size={22} />
              <Text style={{ color: colors.text, fontSize: 12, marginTop: 6, textAlign: 'center' }}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Popular routes" actionLabel="See all" onAction={() => router.push('/(tabs)/routes')} />
        {routesQ.isLoading ? <LoadingIndicator /> : (routesQ.data ?? []).map((r: any) => (
          <RouteCard key={r.id} route={r} onPress={() => router.push(`/route/${r.id}`)} />
        ))}

        <SectionHeader title="Active alerts" actionLabel="All" onAction={() => router.push('/alerts')} />
        {(alertsQ.data ?? []).slice(0, 3).map((a: any) => (
          <AlertCard key={a.id} alert={a} onPress={() => router.push(`/alerts/${a.id}`)} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  name: { fontSize: 22, fontWeight: '700' },
  search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, height: 48, paddingHorizontal: 16, marginTop: 16 },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
});