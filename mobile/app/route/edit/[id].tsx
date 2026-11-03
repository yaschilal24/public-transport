import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { ScreenContainer } from '../../../src/components/ScreenContainer';
import { Input } from '../../../src/components/Input';
import { Button } from '../../../src/components/Button';
import { LoadingIndicator } from '../../../src/components/LoadingIndicator';
import { useTheme } from '../../../src/theme/ThemeContext';
import { api } from '../../../src/services/api';

const statuses = ['ACTIVE', 'SUSPENDED', 'MAINTENANCE'];

export default function EditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, setValue, watch } = useForm();

  const currentStatus = watch('status');

  // Fetch the existing route data
  const routeQ = useQuery({
    queryKey: ['route', id],
    queryFn: async () => (await api.get(`/routes/${id}`)).data.data,
    enabled: !!id,
  });

  // Pre-fill the form when data arrives
  useEffect(() => {
    if (routeQ.data) {
      reset({
        routeName: routeQ.data.routeName,
        startLocation: routeQ.data.startLocation,
        endLocation: routeQ.data.endLocation,
        estimatedDuration: String(routeQ.data.estimatedDuration),
        fare: routeQ.data.fare ? String(routeQ.data.fare) : '',
        status: routeQ.data.status,
      });
    }
  }, [routeQ.data, reset]);

  // Submit mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.put(`/routes/${id}`, {
        routeName: data.routeName,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        estimatedDuration: Number(data.estimatedDuration),
        fare: data.fare ? Number(data.fare) : undefined,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route', id] });
      Alert.alert('Success', 'Route updated successfully!');
      router.back();
    },
    onError: (e: any) => Alert.alert('Failed', e.response?.data?.message ?? 'Network error'),
  });

  if (routeQ.isLoading) return <ScreenContainer><LoadingIndicator /></ScreenContainer>;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Edit Route' }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <Controller control={control} name="routeName" render={({ field: { onChange, value } }) => (
          <Input label="Route Name" value={value} onChangeText={onChange} />
        )} />

        <Controller control={control} name="startLocation" render={({ field: { onChange, value } }) => (
          <Input label="Start Location" value={value} onChangeText={onChange} />
        )} />

        <Controller control={control} name="endLocation" render={({ field: { onChange, value } }) => (
          <Input label="End Location" value={value} onChangeText={onChange} />
        )} />

        <Controller control={control} name="estimatedDuration" render={({ field: { onChange, value } }) => (
          <Input label="Estimated Duration (minutes)" value={value} onChangeText={onChange} keyboardType="numeric" />
        )} />

        <Controller control={control} name="fare" render={({ field: { onChange, value } }) => (
          <Input label="Fare (optional)" value={value} onChangeText={onChange} keyboardType="numeric" />
        )} />

        <Text style={{ color: colors.textMuted, marginBottom: 8, marginTop: 8 }}>Status</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          {statuses.map((s) => (
            <Pressable
              key={s}
              onPress={() => setValue('status', s)}
              style={{
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1,
                borderColor: colors.border, backgroundColor: currentStatus === s ? colors.primary : colors.surface,
              }}
            >
              <Text style={{ color: currentStatus === s ? '#fff' : colors.text, fontSize: 12 }}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <Button title="Save Changes" onPress={handleSubmit((d) => updateMutation.mutate(d))} loading={updateMutation.isPending} />
      </ScrollView>
    </ScreenContainer>
  );
}