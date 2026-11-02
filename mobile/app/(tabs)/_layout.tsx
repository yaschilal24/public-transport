import { Tabs } from 'expo-router';
import { Home, Bus, Map, Heart, User } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
          tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen name="routes" options={{ title: 'Routes', tabBarIcon: ({ color, size }) => <Bus color={color} size={size} /> }} />
      <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: ({ color, size }) => <Map color={color} size={size} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: ({ color, size }) => <Heart color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}