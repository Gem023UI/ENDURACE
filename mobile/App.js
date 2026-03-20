import React, { useCallback, useEffect, useRef } from 'react';
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
import {
  setupNotificationChannel,
  addNotificationResponseListener,
  getLastNotificationResponse,
} from './src/utils/notificationSetup';

import FrontPageScreen from './src/screens/FrontPageScreen';
import AuthLayout      from './src/layout/AuthLayout';
import MainLayout      from './src/layout/MainLayout';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loading } = useAuth();
  const dispatch    = useDispatch();
  const navRef      = useRef(null);

  useEffect(() => {
    // SQLite cart
    initCartDB();
    dispatch(hydrateCart());

    // Notification channel (Android)
    setupNotificationChannel();

    // ── Handle notification tap (foreground / background) ────────
    const unsub = addNotificationResponseListener((data) => {
      navigateFromNotification(data);
    });

    // ── Handle tap when app was killed ───────────────────────────
    getLastNotificationResponse().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        navigateFromNotification(data);
      }
    });

    return unsub;
  }, []);

  const navigateFromNotification = (data) => {
    if (!navRef.current) return;
    const nav = navRef.current;

    if (data?.screen === 'OrderInfo' && data?.orderId) {
      // Navigate into Main → OrderInfo, passing orderId so the screen
      // fetches the latest order from the API.
      nav.navigate('Main', {
        screen: 'OrderInfo',
        params: { orderId: data.orderId },
      });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#010101', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FrontPage" component={FrontPageScreen} />
        <Stack.Screen name="Auth"      component={AuthLayout} />
        <Stack.Screen name="Main"      component={MainLayout} />
      </Stack.Navigator>
    </NavigationContainer>
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
        <RootNavigator onReady={onLayoutRootView} />
      </AuthProvider>
    </Provider>
  );
}