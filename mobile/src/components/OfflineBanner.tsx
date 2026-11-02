import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useTheme } from '../theme/ThemeContext';

export function OfflineBanner() {
  const online = useNetworkStatus();
  const { colors } = useTheme();
  if (online) return null;
  return (
    <View style={[styles.bar, { backgroundColor: colors.warning }]}>
      <Text style={styles.text}>You are offline. Cached data may be out of date.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingVertical: 6, alignItems: 'center' },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
});