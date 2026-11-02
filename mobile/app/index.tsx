import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/theme/ThemeContext';
import { authStorage } from '../src/storage/authStorage'; // NEW IMPORT

export default function Splash() {
  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      // Use authStorage instead of SecureStore
      const token = await authStorage.getItemAsync('accessToken').catch(() => null);
      const onboarded = await AsyncStorage.getItem('onboarded').catch(() => null);
      
      if (token) router.replace('/(tabs)');
      else if (onboarded === 'true') router.replace('/(auth)/login');
      else router.replace('/(onboarding)');
    })();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });