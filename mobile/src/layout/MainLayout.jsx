import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();

const MainLayout = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    {/* Main user screens */}
    <Stack.Screen name="Landing"         component={LandingPageScreen} />
    <Stack.Screen name="Cart"            component={CartScreen} />
    <Stack.Screen name="Wishlist"        component={WishlistScreen} />
    <Stack.Screen name="Orders"          component={OrdersScreen} />
    <Stack.Screen name="Profile"         component={ProfileScreen} />
    <Stack.Screen name="ProductInfo"     component={ProductInfoScreen} />
    <Stack.Screen name="OrderInfo"       component={OrderInfoScreen} />
    <Stack.Screen name="MyReviews"       component={MyReviewsScreen} />
    {/* Notification destination screens */}
    <Stack.Screen name="Promotion"       component={PromotionScreen} />
    {/* Admin screens */}
    <Stack.Screen name="AdminProducts"   component={AdminProductsScreen} />
    <Stack.Screen name="AddEditProduct"  component={AddEditProductScreen} />
    <Stack.Screen name="AdminOrders"     component={AdminOrdersScreen} />
    <Stack.Screen name="AdminDiscounts"  component={AdminDiscountsScreen} />
  </Stack.Navigator>
);

export default MainLayout;