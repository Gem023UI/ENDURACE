import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, Dimensions,
  SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadMyOrders } from '../store/orderSlice';
import { useAuth } from '../context/auth';
import PageHeader from '../components/PageHeader';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');
const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

export const ORDER_STATUS = {
  PENDING:   { label: 'Pending',   color: '#aaaaaa' },
  CANCELED:  { label: 'Canceled',  color: '#ff3131' },
  TO_SHIP:   { label: 'To Ship',   color: '#ffde59' },
  DELIVERED: { label: 'Delivered', color: '#38b6ff' },
};

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();
  const { myOrders, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    if (accessToken) dispatch(loadMyOrders(accessToken));
  }, [accessToken]);

  const renderOrderItem = ({ item }) => {
    const status = ORDER_STATUS[item.status] || ORDER_STATUS.PENDING;
    const isYellow = item.status === 'TO_SHIP';

    return (
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OrderInfo', { orderId: item._id })}
      >
        <View style={styles.orderTopRow}>
          <Text style={styles.orderId}>
            {item._id?.slice(-8).toUpperCase() || item._id}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={[styles.statusText, isYellow && { color: '#010101' }]}>
              {status.label}
            </Text>
          </View>
        </View>
        <View style={styles.orderBottomRow}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-PH', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </Text>
          <Text style={styles.orderTotal}>Php. {item.total?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <FlatList
            data={myOrders}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={<PageHeader title="ORDERS" />}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={() => dispatch(loadMyOrders(accessToken))}
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>You have no orders yet.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Orders" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  safeArea: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontFamily: 'Montserrat_400Regular', color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  listContent: { paddingBottom: 100, paddingTop: 8 },
  orderCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    marginHorizontal: 12, marginVertical: 6, borderRadius: 8, padding: 14,
  },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderId: { fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#010101' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  orderBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderDate: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: '#3a3a3a' },
  orderTotal: { fontFamily: 'Montserrat_700Bold', fontSize: 15, fontWeight: '700', color: '#010101' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});

export default OrdersScreen;