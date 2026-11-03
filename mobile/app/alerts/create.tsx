import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function CreateAlert() {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/alerts', {
        title,
        description,
        severity,
        startDate: new Date().toISOString(),
      });
    },
    onSuccess: () => { Alert.alert('Success', 'Alert published successfully'); router.back(); },
    onError: (e: any) => Alert.alert('Failed', e.response?.data?.message ?? 'Network error'),
  });

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Publish Alert' }} />
      
      <Text style={{ color: colors.textMuted, marginBottom: 8 }}>Severity</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {severities.map((s) => (
          <Pressable
            key={s}
            onPress={() => setSeverity(s)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1,
              borderColor: colors.border, backgroundColor: severity === s ? colors.primary : colors.surface,
            }}
          >
            <Text style={{ color: severity === s ? '#fff' : colors.text, fontSize: 12 }}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g., Route B01 Delayed" />
      <Input label="Description" value={description} onChangeText={setDescription} multiline style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }} />
      
      <Button title="Publish Alert" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!title || !description} />
    </ScreenContainer>
  );
}