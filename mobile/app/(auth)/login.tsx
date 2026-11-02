import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/authStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: FormData) {
    try {
      await login(data.email.trim(), data.password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert(
        'Login failed',
        e.response?.data?.message ?? 'Network error. Check your connection and try again.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.brand, { color: colors.primary }]}>TRANSITCONNECT</Text>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Sign in to see your routes, nearby stops and service alerts.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="you@example.com"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
          )}
        />

        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotWrap}
          hitSlop={8}
        >
          <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>
            Forgot password?
          </Text>
        </Pressable>

        <Button
          title="Log in"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />

        <View style={styles.footer}>
          <Text style={{ color: colors.textMuted }}>New to TransitConnect? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')} hitSlop={8}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              Create an account
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.demoBox,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.demoTitle, { color: colors.text }]}>Demo accounts</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            user@transitconnect.demo — DemoPass123!
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            admin@transitconnect.demo — DemoPass123!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  brand: { fontSize: 13, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  demoBox: { marginTop: 32, borderWidth: 1, borderRadius: 12, padding: 12 },
  demoTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
});