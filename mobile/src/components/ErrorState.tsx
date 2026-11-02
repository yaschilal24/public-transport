import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Button } from './Button';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <AlertCircle color={colors.error} size={40} />
      <Text style={[styles.msg, { color: colors.text }]}>{message}</Text>
      {onRetry ? <Button title="Retry" onPress={onRetry} style={{ marginTop: 16, paddingHorizontal: 32 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  msg: { fontSize: 14, marginTop: 12, textAlign: 'center' },
});