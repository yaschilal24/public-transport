import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const { colors } = useTheme();
  const bg =
    variant === 'primary' ? colors.primary :
    variant === 'secondary' ? colors.secondary :
    variant === 'danger' ? colors.error :
    'transparent';
  const fg = variant === 'outline' ? colors.primary : '#fff';
  const border = variant === 'outline' ? colors.primary : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor: border, borderWidth: variant === 'outline' ? 1 : 0, opacity: pressed || disabled ? 0.7 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.text, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, fontWeight: '600' },
});