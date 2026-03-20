import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { Provider, useDispatch } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import store from './src/store/store';
import { AuthProvider, useAuth } from './src/context/auth';
import { initCartDB } from './src/utils/cartDatabase';
import { hydrateCart } from './src/store/cartSlice';

import FrontPageScreen from './src/screens/FrontPageScreen';
import AuthLayout from './src/layout/AuthLayout';
import MainLayout from './src/layout/MainLayout';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

// Bootstraps DB + cart hydration, then renders navigation
const RootNavigator = () => {
  const { loading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialise SQLite table (idempotent — safe to call every launch)
    initCartDB();
    // Load persisted cart items into Redux
    dispatch(hydrateCart());
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#010101', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FrontPage" component={FrontPageScreen} />
      <Stack.Screen name="Auth" component={AuthLayout} />
      <Stack.Screen name="Main" component={MainLayout} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}