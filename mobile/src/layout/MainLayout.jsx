import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPageScreen from '../screens/LandingPageScreen';
import CartScreen from '../screens/CartScreen';
import WishlistScreen from '../screens/WishlistScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductInfoScreen from '../screens/ProductInfoScreen';
import OrderInfoScreen from '../screens/OrderInfoScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';

const Stack = createNativeStackNavigator();

const MainLayout = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Landing" component={LandingPageScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
      <Stack.Screen name="OrderInfo" component={OrderInfoScreen} />
      {/* Admin screens */}
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
    </Stack.Navigator>
  );
};

export default MainLayout;