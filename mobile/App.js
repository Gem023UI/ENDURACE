import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Oswald_700Bold } from '@expo-google-fonts/oswald';
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';

import FrontPageScreen from './src/screens/FrontPageScreen';
import AuthLayout from './src/layout/AuthLayout';
import MainLayout from './src/layout/MainLayout';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

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
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="FrontPage" component={FrontPageScreen} />
          <Stack.Screen name="Auth" component={AuthLayout} />
          <Stack.Screen name="Main" component={MainLayout} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}