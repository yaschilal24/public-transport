// import React from 'react';
// import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
// import { router } from 'expo-router';
// import { LogOut, Bell, Settings, FileText, Heart, ChevronRight } from 'lucide-react-native';
// import { useQuery } from '@tanstack/react-query';
// import { ScreenContainer } from '../../src/components/ScreenContainer';
// import { useAuthStore } from '../../src/store/authStore';
// import { useTheme } from '../../src/theme/ThemeContext';
// import { api } from '../../src/services/api';

// export default function ProfileScreen() {
//   const { colors } = useTheme();
//   const { user, logout } = useAuthStore();
//   const meQ = useQuery({ queryKey: ['me'], queryFn: async () => (await api.get('/auth/me')).data.data });
//   const profile = meQ.data ?? user;

//   function onLogout() {
//     Alert.alert('Log out', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Log out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
//     ]);
//   }

//   const items = [
//     { label: 'Favorite routes', icon: Heart, onPress: () => router.push('/(tabs)/favorites') },
//     { label: 'My reports', icon: FileText, onPress: () => router.push('/reports') },
//     { label: 'Notifications', icon: Bell, onPress: () => router.push('/notifications') },
//     { label: 'Settings', icon: Settings, onPress: () => router.push('/settings') },
//   ];

//   return (
//     <ScreenContainer>
//       <View style={[styles.header, { borderColor: colors.border }]}>
//         <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
//           <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
//             {profile?.fullName?.[0]?.toUpperCase() ?? '?'}
//           </Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={[styles.name, { color: colors.text }]}>{profile?.fullName ?? 'Passenger'}</Text>
//           <Text style={{ color: colors.textMuted, fontSize: 13 }}>{profile?.email}</Text>
//           {profile?.phone ? <Text style={{ color: colors.textMuted, fontSize: 12 }}>{profile.phone}</Text> : null}
//         </View>
//       </View>

//       {items.map((it) => (
//         <Pressable key={it.label} onPress={it.onPress} style={[styles.row, { borderColor: colors.border }]}>
//           <it.icon color={colors.primary} size={20} />
//           <Text style={{ flex: 1, color: colors.text, marginLeft: 12, fontSize: 15 }}>{it.label}</Text>
//           <ChevronRight color={colors.textMuted} size={18} />
//         </Pressable>
//       ))}

//       <Pressable onPress={onLogout} style={[styles.row, { borderColor: colors.border, marginTop: 12 }]}>
//         <LogOut color={colors.error} size={20} />
//         <Text style={{ flex: 1, color: colors.error, marginLeft: 12, fontSize: 15, fontWeight: '600' }}>Log out</Text>
//       </Pressable>
//     </ScreenContainer>
//   );
// }

// const styles = StyleSheet.create({
//   header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 20, borderBottomWidth: 1, marginBottom: 12 },
//   avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
//   name: { fontSize: 20, fontWeight: '700' },
//   row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
// });

import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LogOut, Bell, Settings, FileText, Heart, ChevronRight, Shield, AlertTriangle } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useAuthStore } from '../../src/store/authStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();
  const meQ = useQuery({ queryKey: ['me'], queryFn: async () => (await api.get('/auth/me')).data.data });
  const profile = meQ.data ?? user;
  const isAdmin = profile?.role === 'ADMIN';

  function onLogout() {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  }

  const userItems = [
    { label: 'Favorite routes', icon: Heart, onPress: () => router.push('/(tabs)/favorites') },
    { label: 'My reports', icon: FileText, onPress: () => router.push('/reports') },
    { label: 'Notifications', icon: Bell, onPress: () => router.push('/notifications') },
    { label: 'Settings', icon: Settings, onPress: () => router.push('/settings') },
  ];

  const adminItems = [
    { label: 'Manage Routes', icon: Shield, onPress: () => router.push('/(tabs)/routes') },
    { label: 'Review All Reports', icon: FileText, onPress: () => router.push('/reports') },
    { label: 'Publish Alert', icon: AlertTriangle, onPress: () => Alert.alert('Admin', 'Alert publisher coming soon') },
  ];

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: isAdmin ? colors.accent : colors.primary }]}>
            <Text style={{ color: isAdmin ? '#000' : '#fff', fontSize: 22, fontWeight: '700' }}>
              {profile?.fullName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>{profile?.fullName ?? 'Passenger'}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{profile?.email}</Text>
            {profile?.phone ? <Text style={{ color: colors.textMuted, fontSize: 12 }}>{profile.phone}</Text> : null}
            {isAdmin && <Text style={{ color: colors.accent, fontSize: 11, fontWeight: 'bold', marginTop: 2 }}>ADMINISTRATOR</Text>}
          </View>
        </View>

        {/* ADMIN DASHBOARD SECTION */}
        {isAdmin && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13, marginVertical: 8, letterSpacing: 1 }}>ADMINISTRATOR TOOLS</Text>
            {adminItems.map((it) => (
              <Pressable key={it.label} onPress={it.onPress} style={[styles.row, { borderColor: colors.border }]}>
                <it.icon color={colors.accent} size={20} />
                <Text style={{ flex: 1, color: colors.text, marginLeft: 12, fontSize: 15, fontWeight: '500' }}>{it.label}</Text>
                <ChevronRight color={colors.textMuted} size={18} />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={{ color: colors.textMuted, fontWeight: '700', fontSize: 13, marginVertical: 8, letterSpacing: 1 }}>MY ACCOUNT</Text>
        {userItems.map((it) => (
          <Pressable key={it.label} onPress={it.onPress} style={[styles.row, { borderColor: colors.border }]}>
            <it.icon color={colors.primary} size={20} />
            <Text style={{ flex: 1, color: colors.text, marginLeft: 12, fontSize: 15 }}>{it.label}</Text>
            <ChevronRight color={colors.textMuted} size={18} />
          </Pressable>
        ))}

        <Pressable onPress={onLogout} style={[styles.row, { borderColor: colors.border, marginTop: 12 }]}>
          <LogOut color={colors.error} size={20} />
          <Text style={{ flex: 1, color: colors.error, marginLeft: 12, fontSize: 15, fontWeight: '600' }}>Log out</Text>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 20, borderBottomWidth: 1, marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
});