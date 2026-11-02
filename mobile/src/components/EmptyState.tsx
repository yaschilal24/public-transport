import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

export function EmptyState({ title, message }: { title: string; message?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Inbox color={colors.textMuted} size={40} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? <Text style={[styles.msg, { color: colors.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  msg: { fontSize: 13, marginTop: 4, textAlign: 'center' },
});