import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

export function StopCard({ stop, distanceKm, onPress }: { stop: any; distanceKm?: number; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <MapPin color={colors.primary} size={22} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{stop.stopName}</Text>
          {stop.address ? <Text style={{ color: colors.textMuted, fontSize: 12 }}>{stop.address}</Text> : null}
        </View>
        {distanceKm != null ? (
          <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>{distanceKm.toFixed(2)} km</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 10 },
  name: { fontSize: 15, fontWeight: '600' },
});