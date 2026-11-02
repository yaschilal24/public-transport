import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function StatusBadge({ status }: { status: string }) {
  const { colors } = useTheme();
  const map: Record<string, string> = {
    ACTIVE: colors.success,
    SUSPENDED: colors.error,
    MAINTENANCE: colors.warning,
    PENDING: colors.warning,
    UNDER_REVIEW: colors.secondary,
    RESOLVED: colors.success,
    REJECTED: colors.error,
    LOW: colors.textMuted,
    MEDIUM: colors.accent,
    HIGH: colors.warning,
    CRITICAL: colors.error,
  };
  const color = map[status] ?? colors.textMuted;
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{status.replace('_', ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '600' },
});