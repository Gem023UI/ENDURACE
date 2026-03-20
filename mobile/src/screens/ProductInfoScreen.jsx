import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCartShopping,
  faBolt,
  faChevronLeft,
  faStar,
  faStarHalfStroke,
  faPenToSquare,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import {
  loadProductReviews,
  loadMyReviewForProduct,
  removeReview,
} from '../store/reviewSlice';
import { useAuth } from '../context/auth';
import ReviewFormModal from '../components/ReviewFormModal';

const { width, height } = Dimensions.get('window');
const BG_IMAGE =
  'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const CATEGORY_COLORS = { RUNNING: '#ff3131', SWIMMING: '#38b6ff', CYCLING: '#ffde59' };
const CATEGORY_TEXT_COLORS = { RUNNING: '#ffffff', SWIMMING: '#ffffff', CYCLING: '#010101' };

const StarDisplay = ({ rating, size = 13 }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <FontAwesomeIcon
        key={s}
        icon={
          s <= Math.floor(rating)
            ? faStar
            : s === Math.ceil(rating) && rating % 1 !== 0
            ? faStarHalfStroke
            : faStarEmpty
        }
        size={size}
        color="#ffde59"
      />
    ))}
  </View>
);

export const showToast = (msg) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else if (Platform.OS === 'ios') {
    Alert.alert('', msg);
  } else if (Platform.OS === 'web') {
    // For web, use console or a web toast library
    console.log(msg);
    // Or implement a custom notification system
  }
};

const ProductInfoScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { user, accessToken } = useAuth();

  const reviews = useSelector((s) => s.reviews.byProduct[product._id] || []);
  const myReview = useSelector((s) => s.reviews.myReviewByProduct[product._id]);
  const reviewsLoading = useSelector((s) => s.reviews.loading);

  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const categoryBg = CATEGORY_COLORS[product.category] || '#3a3a3a';
  const categoryText = CATEGORY_TEXT_COLORS[product.category] || '#ffffff';

  useEffect(() => {
    dispatch(loadProductReviews(product._id));
    if (user && accessToken) {
      dispatch(loadMyReviewForProduct({ productId: product._id, accessToken }));
    }
  }, [product._id]);

  const handleScroll = (e) => {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  // ── Add to Cart ───────────────────────────────────────────────
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        variation: product.variation || '',
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '',
      })
    );
    showToast(`${product.name} added to cart!`);
  };

  // ── Buy Now ───────────────────────────────────────────────────
  const handleBuyNow = () => {
    dispatch(
      addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        variation: product.variation || '',
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '',
      })
    );
    navigation.navigate('Cart');
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    await dispatch(removeReview({ reviewId: myReview._id, productId: product._id, accessToken }));
    setDeleteConfirmVisible(false);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (product.averageRating || 0).toFixed(1);

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.productImage} resizeMode="cover" />
  );

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faChevronLeft} size={18} color="#ffffff" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ── IMAGE SLIDESHOW ── */}
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={product.images}
              renderItem={renderImage}
              keyExtractor={(_, i) => i.toString()}
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={handleScroll} scrollEventThrottle={16}
              getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            />
            <View style={styles.dotsContainer}>
              {product.images.map((_, index) => (
                <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
              ))}
            </View>
          </View>

          {/* ── PRODUCT DETAILS ── */}
          <View style={styles.section}>
            <View style={styles.topRow}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryBg }]}>
                <Text style={[styles.categoryBadgeText, { color: categoryText }]}>{product.category}</Text>
              </View>
              <Text style={styles.price}>Php. {product.price?.toLocaleString()}</Text>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.variation}>Variation: {product.variation}</Text>
          </View>

          <View style={styles.divider} />

          {/* ── DESCRIPTION ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.description}>
              {product.description ||
                'Premium quality endurance sports gear engineered for peak performance. Designed for triathletes, cyclists, runners, and swimmers who demand the best from their equipment.'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* ── REVIEWS ── */}
          <View style={styles.section}>
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {user && !myReview && (
                <TouchableOpacity
                  style={styles.writeReviewBtn}
                  onPress={() => setReviewFormVisible(true)}
                  activeOpacity={0.8}
                >
                  <FontAwesomeIcon icon={faPlus} size={12} color="#010101" />
                  <Text style={styles.writeReviewText}>REVIEW</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.ratingSummaryRow}>
              <Text style={styles.ratingBig}>{avgRating}</Text>
              <View style={styles.ratingSummaryRight}>
                <StarDisplay rating={Number(avgRating)} size={16} />
                <Text style={styles.reviewCount}>
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {myReview && (
              <View style={styles.myReviewBanner}>
                <View style={styles.myReviewLeft}>
                  <Text style={styles.myReviewLabel}>YOUR REVIEW</Text>
                  <StarDisplay rating={myReview.rating} size={13} />
                </View>
                <View style={styles.myReviewActions}>
                  <TouchableOpacity style={styles.editReviewBtn} onPress={() => setReviewFormVisible(true)}>
                    <FontAwesomeIcon icon={faPenToSquare} size={14} color="#010101" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteReviewBtn} onPress={() => setDeleteConfirmVisible(true)}>
                    <FontAwesomeIcon icon={faTrash} size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {reviewsLoading ? (
              <ActivityIndicator color="#ffffff" style={{ marginTop: 20 }} />
            ) : reviews.length === 0 ? (
              <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
            ) : (
              reviews.map((review) => (
                <View key={review._id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{
                        uri: review.userAvatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=38b6ff&color=fff&size=80`,
                      }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewMeta}>
                      <View style={styles.reviewNameRow}>
                        <Text style={styles.reviewerName}>{review.userName}</Text>
                        {review.verifiedPurchase && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓ Verified</Text>
                          </View>
                        )}
                      </View>
                      <StarDisplay rating={review.rating} />
                      <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('en-PH', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── STICKY BOTTOM ACTIONS ── */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.85} onPress={handleAddToCart}>
          <FontAwesomeIcon icon={faCartShopping} size={18} color="#010101" />
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} activeOpacity={0.85} onPress={handleBuyNow}>
          <FontAwesomeIcon icon={faBolt} size={18} color="#ffffff" />
          <Text style={styles.buyNowText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>

      <ReviewFormModal
        visible={reviewFormVisible}
        onClose={() => setReviewFormVisible(false)}
        productId={product._id}
        existingReview={myReview || null}
      />

      <Modal visible={deleteConfirmVisible} transparent animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>DELETE REVIEW</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your review? This cannot be undone.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setDeleteConfirmVisible(false)}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDeleteBtn} onPress={handleDeleteReview}>
                <Text style={styles.modalDeleteText}>DELETE</Text>
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
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  safeArea: { flex: 1 },
  backBtn: {
    position: 'absolute', top: 56, left: 16, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', width: 38, height: 38,
    borderRadius: 19, alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: { paddingBottom: 20 },
  imageContainer: { width, height: height * 0.42, backgroundColor: '#010101' },
  productImage: { width, height: height * 0.42 },
  dotsContainer: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: '#ffffff', width: 20, borderRadius: 4 },
  section: { paddingHorizontal: 18, paddingVertical: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  categoryBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  price: { fontFamily: 'Montserrat_700Bold', fontSize: 22, fontWeight: '700', color: '#ffffff' },
  productName: { fontFamily: 'Oswald_700Bold', fontSize: 28, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1, marginBottom: 6 },
  variation: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 18 },
  sectionTitle: { fontFamily: 'Oswald_700Bold', fontSize: 18, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1, marginBottom: 10 },
  description: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 22 },
  reviewHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  writeReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffde59', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  writeReviewText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, fontWeight: '700', color: '#010101' },
  ratingSummaryRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  ratingBig: { fontFamily: 'Oswald_700Bold', fontSize: 42, fontStyle: 'italic', color: '#ffffff' },
  ratingSummaryRight: { gap: 4 },
  reviewCount: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  myReviewBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,222,89,0.12)', borderWidth: 1, borderColor: 'rgba(255,222,89,0.4)',
    borderRadius: 8, padding: 12, marginBottom: 16,
  },
  myReviewLeft: { gap: 4 },
  myReviewLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 10, fontWeight: '700', color: '#ffde59', letterSpacing: 1 },
  myReviewActions: { flexDirection: 'row', gap: 8 },
  editReviewBtn: { backgroundColor: '#ffde59', width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  deleteReviewBtn: { backgroundColor: '#ff3131', width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  noReviews: { fontFamily: 'Montserrat_400Regular', color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  reviewCard: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 12 },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22 },
  reviewMeta: { flex: 1, gap: 3 },
  reviewNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  reviewerName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff' },
  verifiedBadge: { backgroundColor: 'rgba(56,182,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { fontFamily: 'Montserrat_400Regular', fontSize: 10, color: '#38b6ff' },
  reviewDate: { fontFamily: 'Montserrat_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  reviewText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  addToCartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: 8, height: 48 },
  addToCartText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#010101', letterSpacing: 0.5 },
  buyNowBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ff3131', borderRadius: 8, height: 48 },
  buyNowText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalBox: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 24, width: '100%' },
  modalTitle: { fontFamily: 'Oswald_700Bold', fontSize: 22, fontStyle: 'italic', color: '#ffffff', textAlign: 'center', letterSpacing: 1, marginBottom: 12 },
  modalMessage: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: '#cccccc', lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, backgroundColor: '#3a3a3a', borderRadius: 6, height: 48, alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { fontFamily: 'Montserrat_700Bold', color: '#ffffff', fontWeight: '700', fontSize: 14 },
  modalDeleteBtn: { flex: 1, backgroundColor: '#ff3131', borderRadius: 6, height: 48, alignItems: 'center', justifyContent: 'center' },
  modalDeleteText: { fontFamily: 'Montserrat_700Bold', color: '#ffffff', fontWeight: '700', fontSize: 14 },
});

export default ProductInfoScreen;