import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { StatusBadge } from './StatusBadge';

interface Props {
  route: any;
  onPress: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

export function RouteCard({ route, onPress, onFavoriteToggle, isFavorite }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Text style={[styles.num, { color: colors.primary }]}>{route.routeNumber}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <StatusBadge status={route.status} />
          {onFavoriteToggle ? (
            <Pressable onPress={onFavoriteToggle} hitSlop={12}>
              <Heart color={isFavorite ? colors.error : colors.textMuted} fill={isFavorite ? colors.error : 'transparent'} size={20} />
            </Pressable>
          ) : null}
        </View>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{route.routeName}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
        {route.startLocation} → {route.endLocation}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
        {route.transportType} · ~{route.estimatedDuration} min
        {typeof route._count?.routeStops === 'number' ? ` · ${route._count.routeStops} stops` : ''}
        {route.fare != null ? ` · ${route.fare}` : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  num: { fontSize: 16, fontWeight: '700' },
  name: { fontSize: 15, fontWeight: '600' },
});