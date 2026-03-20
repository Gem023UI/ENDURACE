import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateQuantity,
  removeFromCart,
  removeItems,
  clearCart,
  selectCartItems,
  selectCartTotal,
} from '../store/cartSlice';
import PageHeader from '../components/PageHeader';
import CartList from '../components/CartList';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');
const BG_IMAGE =
  'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const hydrated = useSelector((s) => s.cart.hydrated);

  const [checkedIds, setCheckedIds] = useState([]);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [pendingRemoveItem, setPendingRemoveItem] = useState(null);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const slideAnim = useRef(new Animated.Value(100)).current;

  const hasChecked = checkedIds.length > 0;

  // Checked items derived from cart
  const checkedItems = cartItems.filter((i) => checkedIds.includes(i.id));
  const checkedTotal = checkedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // Slide action bar in/out
  const showActionBar = (show) => {
    Animated.timing(slideAnim, {
      toValue: show ? 0 : 100,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  // Keep action bar in sync when items are removed externally
  useEffect(() => {
    const stillChecked = checkedIds.filter((id) =>
      cartItems.some((i) => i.id === id)
    );
    if (stillChecked.length !== checkedIds.length) {
      setCheckedIds(stillChecked);
      showActionBar(stillChecked.length > 0);
    }
  }, [cartItems]);

  // ── Quantity change ───────────────────────────────────────────
  const handleQuantityChange = (id, newQty) => {
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  // ── Minus at qty 1 → show remove confirmation ─────────────────
  const handleMinusAtOne = (item) => {
    setPendingRemoveItem(item);
    setRemoveModalVisible(true);
  };

  const confirmRemoveSingle = () => {
    if (pendingRemoveItem) {
      dispatch(removeFromCart(pendingRemoveItem.id));
      setCheckedIds((prev) => prev.filter((id) => id !== pendingRemoveItem.id));
    }
    setRemoveModalVisible(false);
    setPendingRemoveItem(null);
  };

  // ── Checkbox toggle ───────────────────────────────────────────
  const handleCheckToggle = (id) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      showActionBar(next.length > 0);
      return next;
    });
  };

  // ── Batch remove checked items ────────────────────────────────
  const handleBatchRemove = () => {
    dispatch(removeItems(checkedIds));
    setCheckedIds([]);
    showActionBar(false);
  };

  // ── Checkout ──────────────────────────────────────────────────
  const handleCheckout = () => {
    setCheckoutModalVisible(true);
    setCheckoutSuccess(false);
  };

  const confirmCheckout = () => {
    // Remove only the checked items from SQLite + Redux
    dispatch(removeItems(checkedIds));
    setCheckedIds([]);
    showActionBar(false);
    setCheckoutSuccess(true);
  };

  const closeCheckoutModal = () => {
    setCheckoutModalVisible(false);
    setCheckoutSuccess(false);
    if (checkoutSuccess) {
      navigation.navigate('Orders');
    }
  };

  // ── Select all toggle ─────────────────────────────────────────
  const handleSelectAll = () => {
    if (checkedIds.length === cartItems.length) {
      setCheckedIds([]);
      showActionBar(false);
    } else {
      const allIds = cartItems.map((i) => i.id);
      setCheckedIds(allIds);
      showActionBar(allIds.length > 0);
    }
  };

  const allChecked =
    cartItems.length > 0 && checkedIds.length === cartItems.length;

  if (!hydrated) {
    return (
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <PageHeader title="CART" />
              {/* Select all row */}
              {cartItems.length > 0 && (
                <TouchableOpacity
                  style={styles.selectAllRow}
                  onPress={handleSelectAll}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.selectAllBox,
                      allChecked && styles.selectAllBoxChecked,
                    ]}
                  >
                    {allChecked && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.selectAllText}>
                    {allChecked ? 'Deselect All' : 'Select All'}
                  </Text>
                  <Text style={styles.cartCount}>
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty.</Text>
              <TouchableOpacity
                style={styles.shopBtn}
                onPress={() => navigation.navigate('Landing')}
                activeOpacity={0.85}
              >
                <Text style={styles.shopBtnText}>SHOP NOW</Text>
              </TouchableOpacity>
            </View>
          }
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

      {/* ── Sliding Action Bar ── */}
      {hasChecked && (
        <Animated.View
          style={[styles.actionBar, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Summary */}
          <View style={styles.actionSummary}>
            <Text style={styles.actionSummaryLabel}>
              {checkedIds.length} selected
            </Text>
            <Text style={styles.actionSummaryTotal}>
              Php. {checkedTotal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={handleBatchRemove}
              activeOpacity={0.85}
            >
              <Text style={styles.removeBtnText}>REMOVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Cart" />
      </View>

      {/* ── Remove Single Item Modal ── */}
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
              <Text style={styles.modalHighlight}>
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
                onPress={confirmRemoveSingle}
              >
                <Text style={styles.modalActionText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Checkout Modal ── */}
      <Modal
        visible={checkoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCheckoutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {checkoutSuccess ? (
              <>
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.modalTitle}>ORDER PLACED!</Text>
                <Text style={styles.modalMessage}>
                  Your order has been placed successfully. You can track it in the Orders screen.
                </Text>
                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={closeCheckoutModal}
                >
                  <Text style={styles.modalActionText}>VIEW ORDERS</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>CHECKOUT</Text>

                {/* Order summary */}
                <View style={styles.checkoutSummary}>
                  {checkedItems.map((item) => (
                    <View key={item.id} style={styles.checkoutRow}>
                      <Text style={styles.checkoutItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.checkoutItemQty}>×{item.quantity}</Text>
                      <Text style={styles.checkoutItemPrice}>
                        Php. {(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.checkoutDivider} />
                  <View style={styles.checkoutRow}>
                    <Text style={styles.checkoutTotalLabel}>TOTAL</Text>
                    <Text style={styles.checkoutTotalValue}>
                      Php. {checkedTotal.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalMessage}>
                  Confirm your order for{' '}
                  <Text style={styles.modalHighlight}>
                    Php. {checkedTotal.toLocaleString()}
                  </Text>
                  ?
                </Text>

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={closeCheckoutModal}
                  >
                    <Text style={styles.modalCancelText}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={confirmCheckout}
                  >
                    <Text style={styles.modalActionText}>CONFIRM</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  safeArea: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: 180, paddingTop: 8 },

  // Select all
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  selectAllBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllBoxChecked: {
    backgroundColor: '#ffffff',
  },
  checkMark: { fontSize: 12, color: '#010101', fontWeight: '700' },
  selectAllText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: '#ffffff',
    flex: 1,
  },
  cartCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // Empty state
  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 16 },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
  },
  shopBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 6,
  },
  shopBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#010101',
    letterSpacing: 1,
  },

  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(1,1,1,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  actionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionSummaryLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  actionSummaryTotal: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionBtns: { flexDirection: 'row', gap: 12 },
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

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },

  // Modals
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
  successEmoji: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
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
  modalHighlight: { fontFamily: 'Montserrat_700Bold', color: '#ffffff', fontWeight: '700' },

  // Checkout summary inside modal
  checkoutSummary: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 6,
  },
  checkoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutItemName: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#cccccc',
    flex: 1,
  },
  checkoutItemQty: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#888',
  },
  checkoutItemPrice: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  checkoutDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 4 },
  checkoutTotalLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  checkoutTotalValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#ffde59',
  },

  modalBtnRow: { flexDirection: 'row', gap: 12 },
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
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: '#38b6ff',
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default CartScreen;