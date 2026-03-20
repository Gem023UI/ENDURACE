import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { faMagnifyingGlass, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const CATEGORIES = ['ALL', 'SWIMMING', 'RUNNING', 'CYCLING'];

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

const PRODUCTS = [
  {
    id: '1',
    name: 'ADIZERO EVO SL',
    variation: 'Black & White',
    price: 9459,
    category: 'RUNNING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174860/cade7624-faf6-482c-b09c-148ee9520063.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png',
    ],
  },
  {
    id: '2',
    name: 'COLNAGO Y1RS',
    variation: 'Black & White',
    price: 9459,
    category: 'CYCLING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png',
    ],
  },
  {
    id: '3',
    name: 'MET Helmet',
    variation: 'Black & White',
    price: 9459,
    category: 'CYCLING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174841/22698711-978e-4d9a-88f7-87ff711abb09.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png',
    ],
  },
  {
    id: '4',
    name: 'TABOLU Cleats Shoes',
    variation: 'Black & White',
    price: 9459,
    category: 'CYCLING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174827/f45dce54-b95f-46ee-ab66-1a9217d124c9.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png',
    ],
  },
  {
    id: '5',
    name: 'Temu - Swimsuit',
    variation: 'Black & White',
    price: 9459,
    category: 'SWIMMING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174813/f4977c60-c6a1-4f41-ad14-7bdb434e3a76.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png',
    ],
  },
  {
    id: '6',
    name: 'Adidas Running Apparel',
    variation: 'Black & White',
    price: 9459,
    category: 'RUNNING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174793/fcd48718-1c40-484c-8c50-63a1c6640930.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174767/5e11096b-5264-415f-a435-1716b1ad7c77.png',
    ],
  },
  {
    id: '7',
    name: 'ADIZERO EVO SL V2',
    variation: 'Black & White',
    price: 9459,
    category: 'RUNNING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174767/5e11096b-5264-415f-a435-1716b1ad7c77.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174964/17fe13c6-79e0-4956-9515-97b734209512.png',
    ],
  },
  {
    id: '8',
    name: 'Pro Swim Goggles',
    variation: 'Black & White',
    price: 9459,
    category: 'SWIMMING',
    images: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174964/17fe13c6-79e0-4956-9515-97b734209512.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772175087/492674d5-4936-4d14-b631-01e4c328a0f3.png',
    ],
  },
];

const CARD_WIDTH = (width - 48) / 2;

const LandingPageScreen = ({ navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setDropdownVisible(false);
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch =
      searchText.trim() === '' ||
      product.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProductCard = ({ item }) => {
    const badgeBg = CATEGORY_COLORS[item.category] || '#3a3a3a';
    const badgeText = CATEGORY_TEXT_COLORS[item.category] || '#ffffff';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductInfo', { product: item })}
      >
        <Image
          source={{ uri: item.images[0] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardInfo}>
          <View style={[styles.categoryBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.categoryBadgeText, { color: badgeText }]}>
              {item.category}
            </Text>
          </View>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>
            Php. {item.price.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No products found.</Text>
    </View>
  );

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.logo}>
              ENDUR<Text style={styles.logoA}>A</Text>
              <Text style={styles.logoC}>C</Text>
              <Text style={styles.logoE}>E</Text>
            </Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setDropdownVisible(!dropdownVisible)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownBtnText}>{selectedCategory} </Text>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  size={14}
                  color="#ffffff"
                  style={{ transform: [{ rotate: dropdownVisible ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
            </View>
          </View>
  
          {/* Search Bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="rgba(255,255,255,0.6)"
                placeholder="Search products..."
              />
              <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
  
          {/* Section Label */}
          <Text style={styles.sectionLabel}>
            {selectedCategory === 'ALL' ? 'All Products' : selectedCategory}
            {'  '}
            <Text style={styles.sectionCount}>({filteredProducts.length})</Text>
          </Text>
  
          {/* Product Grid — rendered manually in rows instead of FlatList */}
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {Array.from({ length: Math.ceil(filteredProducts.length / 2) }).map((_, rowIndex) => {
                const left = filteredProducts[rowIndex * 2];
                const right = filteredProducts[rowIndex * 2 + 1];
                return (
                  <View key={rowIndex} style={styles.row}>
                    {/* Left Card */}
                    <TouchableOpacity
                      style={styles.card}
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('ProductInfo', { product: left })}
                    >
                      <Image
                        source={{ uri: left.images[0] }}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                      <View style={styles.cardInfo}>
                        <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[left.category] || '#3a3a3a' }]}>
                          <Text style={[styles.categoryBadgeText, { color: CATEGORY_TEXT_COLORS[left.category] || '#ffffff' }]}>
                            {left.category}
                          </Text>
                        </View>
                        <Text style={styles.cardName} numberOfLines={2}>{left.name}</Text>
                        <Text style={styles.cardPrice}>Php. {left.price.toLocaleString()}</Text>
                      </View>
                    </TouchableOpacity>
  
                    {/* Right Card — render empty spacer if no right item */}
                    {right ? (
                      <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('ProductInfo', { product: right })}
                      >
                        <Image
                          source={{ uri: right.images[0] }}
                          style={styles.cardImage}
                          resizeMode="cover"
                        />
                        <View style={styles.cardInfo}>
                          <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[right.category] || '#3a3a3a' }]}>
                            <Text style={[styles.categoryBadgeText, { color: CATEGORY_TEXT_COLORS[right.category] || '#ffffff' }]}>
                              {right.category}
                            </Text>
                          </View>
                          <Text style={styles.cardName} numberOfLines={2}>{right.name}</Text>
                          <Text style={styles.cardPrice}>Php. {right.price.toLocaleString()}</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.cardSpacer} />
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
  
      {/* Dropdown Overlay */}
      {dropdownVisible && (
        <>
          <TouchableOpacity
            style={styles.dropdownBackdrop}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          />
          <View style={styles.dropdownMenu}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const catColor = CATEGORY_COLORS[cat];
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategorySelect(cat)}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemActive,
                  ]}
                  activeOpacity={0.7}
                >
                  {catColor && (
                    <View style={[styles.dropdownDot, { backgroundColor: catColor }]} />
                  )}
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
  
      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Landing" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gridContainer: {
    width: '100%',
  },
  cardSpacer: {
    width: CARD_WIDTH,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 16,
    marginBottom: 10,
    marginHorizontal: 6,
  },
  logo: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 26,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logoA: { color: '#ff3131' },
  logoC: { color: '#ffde59' },
  logoE: { color: '#38b6ff' },
  dropdownContainer: { alignItems: 'flex-end' },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  dropdownBtnText: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 20,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
  },

  // Dropdown overlay
  dropdownBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 72,
    right: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 170,
    zIndex: 201,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    boxShadow: '0px 6px 16px rgba(0,0,0,0.6)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 10,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dropdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dropdownItemText: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 18,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  dropdownItemTextActive: {
    color: '#ffffff',
  },

  // Search
  searchRow: {
    paddingHorizontal: 4,
    marginTop: 4,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    height: '100%',
  },
  searchBtn: { padding: 6 },

  // Section label
  sectionLabel: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 10,
    marginHorizontal: 6,
    paddingHorizontal: 4,
  },
  sectionCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    color: 'rgba(255,255,255,0.6)',
  },

  // Product Grid
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH,
  },
  cardInfo: {
    padding: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#010101',
    marginBottom: 4,
  },
  cardPrice: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#3a3a3a',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default LandingPageScreen;