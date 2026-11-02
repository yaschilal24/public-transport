import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, Props>(({ label, error, style, ...rest }, ref) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      {label && <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border, color: colors.text },
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={{ color: colors.error, marginTop: 4, fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: { fontSize: 13, marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, height: 52 },
});