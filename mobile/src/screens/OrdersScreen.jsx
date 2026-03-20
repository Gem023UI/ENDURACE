import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import PageHeader from '../components/PageHeader';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');
const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const ORDER_STATUS = {
  CANCELED: { label: 'Canceled', color: '#ff3131' },
  TO_SHIP: { label: 'To Ship', color: '#ffde59' },
  DELIVERED: { label: 'Delivered', color: '#38b6ff' },
};

const SAMPLE_ORDERS = [
  {
    id: 'ORD-7X92A',
    date: 'March 1, 2026',
    status: 'DELIVERED',
    total: 9459,
    items: [
      { id: '1', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png' },
      { id: '2', name: 'COLNAGO Y1RS', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png' },
      { id: '3', name: 'MET Helmet', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png' },
      { id: '4', name: 'TABOLU Cleats Shoes', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png' },
      { id: '5', name: 'Temu - Swimsuit', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png' },
    ],
  },
  {
    id: 'ORD-3K41B',
    date: 'February 22, 2026',
    status: 'TO_SHIP',
    total: 18918,
    items: [
      { id: '1', name: 'Adidas Running Apparel', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png' },
      { id: '2', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174767/5e11096b-5264-415f-a435-1716b1ad7c77.png' },
      { id: '3', name: 'MET Helmet', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png' },
      { id: '4', name: 'Pro Swim Goggles', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174964/17fe13c6-79e0-4956-9515-97b734209512.png' },
      { id: '5', name: 'Temu - Swimsuit', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png' },
    ],
  },
  {
    id: 'ORD-9M15C',
    date: 'February 10, 2026',
    status: 'CANCELED',
    total: 9459,
    items: [
      { id: '1', name: 'COLNAGO Y1RS', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png' },
      { id: '2', name: 'TABOLU Cleats Shoes', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png' },
      { id: '3', name: 'MET Helmet', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png' },
      { id: '4', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png' },
      { id: '5', name: 'Adidas Running Apparel', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png' },
    ],
  },
  {
    id: 'ORD-2P88D',
    date: 'January 30, 2026',
    status: 'DELIVERED',
    total: 28377,
    items: [
      { id: '1', name: 'Pro Swim Goggles', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174964/17fe13c6-79e0-4956-9515-97b734209512.png' },
      { id: '2', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 3, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png' },
      { id: '3', name: 'COLNAGO Y1RS', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png' },
      { id: '4', name: 'MET Helmet', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png' },
      { id: '5', name: 'Temu - Swimsuit', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png' },
    ],
  },
  {
    id: 'ORD-5R34E',
    date: 'January 15, 2026',
    status: 'TO_SHIP',
    total: 9459,
    items: [
      { id: '1', name: 'Adidas Running Apparel', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png' },
      { id: '2', name: 'TABOLU Cleats Shoes', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png' },
      { id: '3', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png' },
      { id: '4', name: 'MET Helmet', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png' },
      { id: '5', name: 'Pro Swim Goggles', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174964/17fe13c6-79e0-4956-9515-97b734209512.png' },
    ],
  },
  {
    id: 'ORD-8T67F',
    date: 'December 28, 2025',
    status: 'DELIVERED',
    total: 18918,
    items: [
      { id: '1', name: 'COLNAGO Y1RS', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png' },
      { id: '2', name: 'Temu - Swimsuit', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png' },
      { id: '3', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png' },
      { id: '4', name: 'TABOLU Cleats Shoes', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png' },
      { id: '5', name: 'MET Helmet', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png' },
    ],
  },
  {
    id: 'ORD-1W23G',
    date: 'December 10, 2025',
    status: 'CANCELED',
    total: 9459,
    items: [
      { id: '1', name: 'Pro Swim Goggles', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174964/17fe13c6-79e0-4956-9515-97b734209512.png' },
      { id: '2', name: 'Adidas Running Apparel', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png' },
      { id: '3', name: 'COLNAGO Y1RS', variation: 'Black & White', price: 9459, quantity: 2, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png' },
      { id: '4', name: 'ADIZERO EVO SL', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png' },
      { id: '5', name: 'Temu - Swimsuit', variation: 'Black & White', price: 9459, quantity: 1, image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png' },
    ],
  },
];

const OrdersScreen = ({ navigation }) => {
  const renderOrderItem = ({ item }) => {
    const status = ORDER_STATUS[item.status];
    return (
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OrderInfo', { order: item })}
      >
        {/* Top Row: Order ID + Status */}
        <View style={styles.orderTopRow}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={[
              styles.statusText,
              item.status === 'TO_SHIP' && { color: '#010101' },
            ]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Bottom Row: Date + Total */}
        <View style={styles.orderBottomRow}>
          <Text style={styles.orderDate}>{item.date}</Text>
          <Text style={styles.orderTotal}>
            Php. {item.total.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={SAMPLE_ORDERS}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<PageHeader title="ORDERS" />}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Orders" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  safeArea: { flex: 1 },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  orderCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    padding: 14,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#010101',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#3a3a3a',
  },
  orderTotal: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#010101',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export { SAMPLE_ORDERS, ORDER_STATUS };
export default OrdersScreen;