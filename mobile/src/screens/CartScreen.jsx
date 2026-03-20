import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import PageHeader from '../components/PageHeader';
import CartList from '../components/CartList';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const INITIAL_CART = [
  {
    id: '1',
    name: 'ADIZERO EVO SL',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png',
  },
  {
    id: '2',
    name: 'COLNAGO Y1RS',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png',
  },
  {
    id: '3',
    name: 'MET Helmet',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png',
  },
  {
    id: '4',
    name: 'TABOLU Cleats Shoes',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png',
  },
  {
    id: '5',
    name: 'Temu - Swimsuit',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png',
  },
  {
    id: '6',
    name: 'Adidas Running Apparel',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png',
  },
  {
    id: '7',
    name: 'ADIZERO EVO SL',
    variation: 'Black & White',
    price: 9459,
    quantity: 1,
    image: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174767/5e11096b-5264-415f-a435-1716b1ad7c77.png',
  },
];

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [checkedIds, setCheckedIds] = useState([]);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [pendingRemoveItem, setPendingRemoveItem] = useState(null);
  const slideAnim = useRef(new Animated.Value(100)).current;

  const hasChecked = checkedIds.length > 0;

  const showActionBar = (show) => {
    Animated.timing(slideAnim, {
      toValue: show ? 0 : 100,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const handleQuantityChange = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleMinusAtOne = (item) => {
    setPendingRemoveItem(item);
    setRemoveModalVisible(true);
  };

  const handleCheckToggle = (id) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      showActionBar(next.length > 0);
      return next;
    });
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<PageHeader title="CART" />}
          renderItem={({ item }) => (
            <CartList
              item={item}
              onQuantityChange={handleQuantityChange}
              onMinusAtOne={handleMinusAtOne}
              checked={checkedIds.includes(item.id)}
              onCheckToggle={handleCheckToggle}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Sliding Action Bar */}
      {hasChecked && (
        <Animated.View
          style={[
            styles.actionBar,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.removeBtn} activeOpacity={0.85}>
            <Text style={styles.removeBtnText}>REMOVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
            <Text style={styles.checkoutBtnText}>CHECKOUT</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Cart" />
      </View>

      {/* Remove Modal */}
      <Modal
        visible={removeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>REMOVE ITEM</Text>
            <Text style={styles.modalMessage}>
              Would you like to remove{' '}
              <Text style={styles.modalItemName}>
                {pendingRemoveItem?.name}
              </Text>{' '}
              from your cart?
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRemoveModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalRemoveBtn}
                onPress={() => setRemoveModalVisible(false)}
              >
                <Text style={styles.modalRemoveText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 160,
    paddingTop: 8,
  },
  actionBar: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(1,1,1,0.9)',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  removeBtn: {
    flex: 1,
    backgroundColor: '#ff3131',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#010101',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 22,
    fontStyle: 'italic',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalMessage: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItemName: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  modalRemoveBtn: {
    flex: 1,
    backgroundColor: '#ff3131',
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRemoveText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CartScreen;