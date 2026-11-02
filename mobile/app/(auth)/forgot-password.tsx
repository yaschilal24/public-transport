import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { api } from '../../src/services/api';

export default function ForgotPassword() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!email) return Alert.alert('Validation', 'Enter your email.');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      Alert.alert('Notice', 'If this email is registered, you will receive reset instructions shortly.');
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Forgot password</Text>
      <Text style={{ color: colors.textMuted, marginBottom: 20 }}>
        Enter your account email and we will help you reset your password.
      </Text>
      <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Button title={sent ? 'Resend' : 'Send reset link'} onPress={submit} loading={loading} />
      {sent ? <Text style={{ color: colors.success, marginTop: 12, textAlign: 'center' }}>If this email exists, reset instructions have been sent.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
});