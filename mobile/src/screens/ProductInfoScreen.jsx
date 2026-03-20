import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCartShopping,
  faBolt,
  faChevronLeft,
  faStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const REVIEWS = [
  {
    id: '1',
    name: 'Maria Santos',
    avatar: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1756965501/main-sample.png',
    rating: 5,
    date: 'February 20, 2026',
    review:
      'Absolutely love this product! The quality is top-notch and it arrived faster than expected. Highly recommend to any triathlete looking for gear that performs as good as it looks.',
  },
  {
    id: '2',
    name: 'Juan dela Cruz',
    avatar: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1756965499/samples/man-portrait.jpg',
    rating: 4,
    date: 'January 15, 2026',
    review:
      'Great product overall. Fits true to size and the material feels very durable. Only minor issue is the color was slightly different from the photos, but still very satisfied with my purchase.',
  },
  {
    id: '3',
    name: 'Alex Rivera',
    avatar: 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1756965498/samples/shoe.jpg',
    rating: 5,
    date: 'March 1, 2026',
    review:
      'Used this in my last Ironman and it held up perfectly through all conditions. The fit is ergonomic and performance is unmatched at this price point. Will definitely buy again!',
  },
];

const CATEGORY_COLORS = {
  RUNNING: '#ff3131',
  SWIMMING: '#38b6ff',
  CYCLING: '#ffde59',
};

const CATEGORY_TEXT_COLORS = {
  RUNNING: '#ffffff',
  SWIMMING: '#ffffff',
  CYCLING: '#010101',
};

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} size={14} color="#ffde59" />
      );
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStarHalfStroke} size={14} color="#ffde59" />
      );
    } else {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStarEmpty} size={14} color="#ffde59" />
      );
    }
  }
  return <View style={{ flexDirection: 'row', gap: 2 }}>{stars}</View>;
};

const ProductInfoScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const categoryBg = CATEGORY_COLORS[product.category] || '#3a3a3a';
  const categoryText = CATEGORY_TEXT_COLORS[product.category] || '#ffffff';

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.productImage} resizeMode="cover" />
  );

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faChevronLeft} size={18} color="#ffffff" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── IMAGE SLIDESHOW ── */}
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={product.images}
              renderItem={renderImage}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />
            <View style={styles.dotsContainer}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          {/* ── PRODUCT DETAILS ── */}
          <View style={styles.section}>
            {/* Category + Price row */}
            <View style={styles.topRow}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryBg }]}>
                <Text style={[styles.categoryBadgeText, { color: categoryText }]}>
                  {product.category}
                </Text>
              </View>
              <Text style={styles.price}>Php. {product.price.toLocaleString()}</Text>
            </View>

            {/* Product Name */}
            <Text style={styles.productName}>{product.name}</Text>

            {/* Variation */}
            <Text style={styles.variation}>Variation: {product.variation}</Text>
          </View>

          {/* ── DIVIDER ── */}
          <View style={styles.divider} />

          {/* ── DESCRIPTION ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.description}>
              Premium quality endurance sports gear engineered for peak performance.
              Designed for triathletes, cyclists, runners, and swimmers who demand the
              best from their equipment. Lightweight, aerodynamic, and built to last
              through the most grueling training sessions and race conditions.
            </Text>
          </View>

          {/* ── DIVIDER ── */}
          <View style={styles.divider} />

          {/* ── REVIEWS ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <Text style={styles.reviewSummary}>
              ⭐ 4.7 out of 5 · {REVIEWS.length} reviews
            </Text>

            {REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                {/* Reviewer Header */}
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: review.avatar }}
                    style={styles.reviewAvatar}
                  />
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <StarRating rating={review.rating} />
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                {/* Review Text */}
                <Text style={styles.reviewText}>{review.review}</Text>
              </View>
            ))}
          </View>

          {/* Bottom padding for footer */}
          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── STICKY BOTTOM ACTIONS ── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
        >
          <FontAwesomeIcon icon={faCartShopping} size={18} color="#010101" />
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowBtn} activeOpacity={0.85}>
          <FontAwesomeIcon icon={faBolt} size={18} color="#ffffff" />
          <Text style={styles.buyNowText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  safeArea: { flex: 1 },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Image Slideshow
  imageContainer: {
    width,
    height: height * 0.42,
    backgroundColor: '#010101',
  },
  productImage: {
    width,
    height: height * 0.42,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 20,
    borderRadius: 4,
  },

  // Sections
  section: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  price: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  productName: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 6,
  },
  variation: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 18,
  },
  sectionTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
  },

  // Reviews
  reviewSummary: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 14,
  },
  reviewCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(41, 41, 41, 0.3)',
  },
  reviewMeta: {
    flex: 1,
    gap: 3,
  },
  reviewerName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  reviewDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  reviewText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },

  // Sticky Action Bar — sits above footer nav
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 48,
  },
  addToCartText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#010101',
    letterSpacing: 0.5,
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff3131',
    borderRadius: 8,
    height: 48,
  },
  buyNowText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

export default ProductInfoScreen;