import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useTheme } from '../../src/theme/ThemeContext';

export default function Settings() {
  const { colors, mode, setMode } = useTheme();

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Settings' }} />
      <Text style={[styles.section, { color: colors.textMuted }]}>APPEARANCE</Text>
      {(['light', 'dark', 'system'] as const).map((m) => (
        <Pressable
          key={m}
          onPress={() => setMode(m)}
          style={[styles.row, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, fontSize: 15, textTransform: 'capitalize' }}>{m}</Text>
          <View style={[styles.radio, { borderColor: colors.primary }]}>
            {mode === m ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
          </View>
        </Pressable>
      ))}
      <Text style={[styles.section, { color: colors.textMuted, marginTop: 24 }]}>ABOUT</Text>
      <Text style={{ color: colors.text }}>TransitConnect v1.0.0</Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
        University project — demonstration data only.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});