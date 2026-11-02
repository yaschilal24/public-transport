// import { useEffect, useState } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { useQuery } from '@tanstack/react-query';
// import { router } from 'expo-router';
// import { useTheme } from '../../src/theme/ThemeContext';
// import { api } from '../../src/services/api';

// export default function MapScreen() {
//   const { colors } = useTheme();
//   const [region, setRegion] = useState<any>(null);

//   const stopsQ = useQuery({ queryKey: ['map-stops'], queryFn: async () => (await api.get('/stops?limit=50')).data.data });

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setRegion({ latitude: 9.005, longitude: 38.760, latitudeDelta: 0.1, longitudeDelta: 0.1 });
//         return;
//       }
//       const loc = await Location.getCurrentPositionAsync({});
//       setRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
//     })();
//   }, []);

//   if (!region) return <View style={[styles.container, { backgroundColor: colors.background }]} />;

//   return (
//     <View style={styles.container}>
//       <MapView style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation>
//         {(stopsQ.data ?? []).map((s: any) => (
//           <Marker
//             key={s.id}
//             coordinate={{ latitude: s.latitude, longitude: s.longitude }}
//             title={s.stopName}
//             description={s.address ?? 'Demo stop'}
//             onCalloutPress={() => router.push(`/stop/${s.id}`)}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({ container: { flex: 1 } });


import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { api } from '../../src/services/api';

// Conditionally import react-native-maps so it doesn't crash on the web
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function MapScreen() {
  const { colors } = useTheme();
  const [region, setRegion] = useState<any>(null);

  const stopsQ = useQuery({ queryKey: ['map-stops'], queryFn: async () => (await api.get('/stops?limit=50')).data.data });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setRegion({ latitude: 9.005, longitude: 38.760, latitudeDelta: 0.1, longitudeDelta: 0.1 });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
    })();
  }, []);

  // If running on the web, show a placeholder instead of the map
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Map not available on Web
        </Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
          The interactive map requires a native device. Please test this screen on your Android phone using Expo Go.
        </Text>
      </View>
    );
  }

  if (!region) return <View style={[styles.container, { backgroundColor: colors.background }]} />;

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation>
        {(stopsQ.data ?? []).map((s: any) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            title={s.stopName}
            description={s.address ?? 'Demo stop'}
            onCalloutPress={() => router.push(`/stop/${s.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });