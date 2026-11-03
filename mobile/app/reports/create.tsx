import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert, Pressable, Image } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useMutation } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

const categories = ['DELAY', 'DAMAGED_VEHICLE', 'UNSAFE_CONDITION', 'INCORRECT_INFO', 'MISSING_STOP', 'OTHER'];

export default function CreateReport() {
  const { routeId } = useLocalSearchParams<{ routeId?: string }>();
  const { colors } = useTheme();
  const [category, setCategory] = useState('DELAY');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ['images'], // <-- FIXED: New Expo API
      quality: 0.7 
    });
    if (!res.canceled && res.assets[0]) setImageUri(res.assets[0].uri);
  }

  async function captureLocation() {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') { Alert.alert('Permission denied'); return; }
    const pos = await Location.getCurrentPositionAsync({});
    setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/reports', {
        category,
        description,
        routeId: routeId || undefined,
        latitude: coords?.lat,
        longitude: coords?.lon,
        imageUrl: imageUri ?? undefined,
      });
    },
    onSuccess: () => { Alert.alert('Report submitted'); router.replace('/reports'); },
    onError: (e: any) => Alert.alert('Failed', e.response?.data?.message ?? 'Network error'),
  });

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'New report' }} />
      <Text style={{ color: colors.textMuted, marginBottom: 8 }}>Category</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1,
              borderColor: colors.border, backgroundColor: category === c ? colors.primary : colors.surface,
            }}
          >
            <Text style={{ color: category === c ? '#fff' : colors.text, fontSize: 12 }}>{c.replace('_', ' ')}</Text>
          </Pressable>
        ))}
      </View>
      <Input label="Description" value={description} onChangeText={setDescription} multiline style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }} />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Button title={imageUri ? 'Change image' : 'Add image'} variant="outline" onPress={pickImage} style={{ flex: 1 }} />
        <Button title={coords ? 'Update location' : 'Attach location'} variant="outline" onPress={captureLocation} style={{ flex: 1 }} />
      </View>
      {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} /> : null}
      {coords ? <Text style={{ color: colors.textMuted, marginBottom: 12 }}>Location: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</Text> : null}
      <Button title="Submit report" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={description.trim().length < 5} />
    </ScreenContainer>
  );
}