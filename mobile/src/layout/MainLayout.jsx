import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions } from 'react-native';

import DrawerContent from '../components/DrawerContent';

import LandingPageScreen    from '../screens/LandingPageScreen';
import CartScreen           from '../screens/CartScreen';
import WishlistScreen       from '../screens/WishlistScreen';
import OrdersScreen         from '../screens/OrdersScreen';
import ProfileScreen        from '../screens/ProfileScreen';
import ProductInfoScreen    from '../screens/ProductInfoScreen';
import OrderInfoScreen      from '../screens/OrderInfoScreen';
import AdminProductsScreen  from '../screens/AdminProductsScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import MyReviewsScreen      from '../screens/MyReviewsScreen';
import AdminOrdersScreen    from '../screens/AdminOrdersScreen';
import AdminDiscountsScreen from '../screens/AdminDiscountsScreen';
import PromotionScreen      from '../screens/PromotionScreen';

const Drawer = createDrawerNavigator();
const Stack  = createNativeStackNavigator();

const { width } = Dimensions.get('window');

/**
 * DrawerStack
 * Houses screens that are accessible from the drawer.
 * Each "root" screen gets its own entry in the drawer so the
 * active route highlights correctly in DrawerContent.
 */
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={{
      headerShown:        false,
      drawerType:         'slide',      // drawer pushes the content aside
      drawerStyle: {
        width:            width * 0.75, // 75% of screen width
        backgroundColor: '#121212',
      },
      overlayColor:       'rgba(0,0,0,0.55)',
      swipeEdgeWidth:     40,           // swipe from left edge to open
    }}
  >
    {/* ── Main user screens (shown in drawer) ── */}
    <Drawer.Screen name="Landing"       component={LandingPageScreen} />
    <Drawer.Screen name="Cart"          component={CartScreen} />
    <Drawer.Screen name="Wishlist"      component={WishlistScreen} />
    <Drawer.Screen name="Orders"        component={OrdersScreen} />
    <Drawer.Screen name="MyReviews"     component={MyReviewsScreen} />
    <Drawer.Screen name="Profile"       component={ProfileScreen} />

    {/* ── Detail / nested screens (hidden from drawer) ── */}
    <Drawer.Screen
      name="ProductInfo"
      component={ProductInfoScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />
    <Drawer.Screen
      name="OrderInfo"
      component={OrderInfoScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />
    <Drawer.Screen
      name="Promotion"
      component={PromotionScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />

    {/* ── Admin screens (hidden from default drawer list; shown conditionally in DrawerContent) ── */}
    <Drawer.Screen
      name="AdminProducts"
      component={AdminProductsScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />
    <Drawer.Screen
      name="AddEditProduct"
      component={AddEditProductScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />
    <Drawer.Screen
      name="AdminOrders"
      component={AdminOrdersScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />
    <Drawer.Screen
      name="AdminDiscounts"
      component={AdminDiscountsScreen}
      options={{ drawerItemStyle: { display: 'none' } }}
    />
  </Drawer.Navigator>
);

/**
 * MainLayout
 * Thin stack wrapper so the rest of the app (App.js) can still do:
 *   navigation.navigate('Main', { screen: 'OrderInfo', params: { orderId } })
 */
const MainLayout = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Drawer" component={DrawerNavigator} />
  </Stack.Navigator>
);

export default MainLayout;