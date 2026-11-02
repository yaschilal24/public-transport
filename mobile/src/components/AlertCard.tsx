import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { StatusBadge } from './StatusBadge';

export function AlertCard({ alert, onPress }: { alert: any; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{alert.title}</Text>
        <StatusBadge status={alert.severity} />
      </View>
      <Text numberOfLines={2} style={{ color: colors.textMuted, fontSize: 13 }}>{alert.description}</Text>
      {alert.route ? (
        <Text style={{ color: colors.primary, fontSize: 12, marginTop: 4 }}>Route {alert.route.routeNumber}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 10 },
  title: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
});