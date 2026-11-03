// import { useEffect, useState } from 'react';
// import { View, StyleSheet, Text, Platform } from 'react-native';
// import * as Location from 'expo-location';
// import { useQuery } from '@tanstack/react-query';
// import { router } from 'expo-router';
// import { useTheme } from '../../src/theme/ThemeContext';
// import { api } from '../../src/services/api';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// let MapView: any = null;
// let Marker: any = null;

// if (Platform.OS !== 'web') {
//   const Maps = require('react-native-maps');
//   MapView = Maps.default;
//   Marker = Maps.Marker;
// }

// export default function MapScreen() {
//   const { colors } = useTheme();
//   const [region, setRegion] = useState<any>(null);

//   const stopsQ = useQuery({ queryKey: ['map-stops'], queryFn: async () => (await api.get('/stops?limit=50')).data.data });

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         // Fallback location if permission denied (Demo City coordinates)
//         setRegion({ latitude: 9.005, longitude: 38.760, latitudeDelta: 0.1, longitudeDelta: 0.1 });
//         return;
//       }
//       const loc = await Location.getCurrentPositionAsync({});
//       setRegion({ 
//         latitude: loc.coords.latitude, 
//         longitude: loc.coords.longitude, 
//         latitudeDelta: 0.05, 
//         longitudeDelta: 0.05 
//       });
//     })();
//   }, []);

//   if (Platform.OS === 'web') {
//     return (
//       <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
//         <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Map not available on Web</Text>
//       </View>
//     );
//   }

//   if (!region) return <View style={[styles.container, { backgroundColor: colors.background }]} />;

//   return (
//     <View style={styles.container}>
//       <MapView 
//         style={StyleSheet.absoluteFill} 
//         initialRegion={region} 
//         showsUserLocation={true}
//         mapType="standard" // <-- Forces standard map (not satellite/black)
//         provider={PROVIDER_GOOGLE} // <-- ADD THIS LINE
//       >
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

// 1. Declare variables ONCE
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

// 2. Only require them if we are NOT on the web
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function MapScreen() {
  const { colors } = useTheme();
  const [region, setRegion] = useState<any>(null);

  const stopsQ = useQuery({ queryKey: ['map-stops'], queryFn: async () => (await api.get('/stops?limit=50')).data.data });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback location if permission denied (Demo City coordinates)
        setRegion({ latitude: 9.005, longitude: 38.760, latitudeDelta: 0.1, longitudeDelta: 0.1 });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({ 
        latitude: loc.coords.latitude, 
        longitude: loc.coords.longitude, 
        latitudeDelta: 0.05, 
        longitudeDelta: 0.05 
      });
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Map not available on Web</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>Please test this screen on your Android phone.</Text>
      </View>
    );
  }

  if (!region) return <View style={[styles.container, { backgroundColor: colors.background }]} />;

  return (
    <View style={styles.container}>
      <MapView 
        style={StyleSheet.absoluteFill} 
        initialRegion={region} 
        showsUserLocation={true}
        mapType="standard"
        provider={PROVIDER_GOOGLE} // <-- Uses the provider variable we defined
      >
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