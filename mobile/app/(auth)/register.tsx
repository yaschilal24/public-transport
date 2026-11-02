import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { api } from '../../src/services/api';

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { colors } = useTheme();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirm: '' },
  });

  async function onSubmit(data: FormData) {
    try {
      await api.post('/auth/register', {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });
      Alert.alert('Success', 'Account created. Please log in.');
      router.replace('/(auth)/login');
    } catch (e: any) {
      Alert.alert('Registration failed', e.response?.data?.message ?? 'Network error');
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
      <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
        <Input label="Full name" value={value} onChangeText={onChange} error={errors.fullName?.message} />
      )} />
      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <Input label="Email" value={value} onChangeText={onChange} autoCapitalize="none" keyboardType="email-address" error={errors.email?.message} />
      )} />
      <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
        <Input label="Phone (optional)" value={value} onChangeText={onChange} keyboardType="phone-pad" error={errors.phone?.message} />
      )} />
      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <Input label="Password" value={value} onChangeText={onChange} secureTextEntry error={errors.password?.message} />
      )} />
      <Controller control={control} name="confirm" render={({ field: { onChange, value } }) => (
        <Input label="Confirm password" value={value} onChangeText={onChange} secureTextEntry error={errors.confirm?.message} />
      )} />
      <Button title="Sign up" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
});