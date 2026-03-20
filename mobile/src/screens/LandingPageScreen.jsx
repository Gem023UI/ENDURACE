import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ImageBackground, Dimensions, SafeAreaView, ScrollView,
  Image, Modal, ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass, faChevronDown,
  faSlidersH, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from '../store/productSlice';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');
const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const CATEGORIES = ['ALL', 'SWIMMING', 'RUNNING', 'CYCLING'];
const CATEGORY_COLORS      = { RUNNING: '#ff3131', SWIMMING: '#38b6ff', CYCLING: '#ffde59' };
const CATEGORY_TEXT_COLORS = { RUNNING: '#ffffff', SWIMMING: '#ffffff', CYCLING: '#010101' };
const CARD_WIDTH = (width - 48) / 2;

// Default max price for the slider — will stretch to match actual product prices
const DEFAULT_MAX = 50000;

const LandingPageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products);

  // ── Filter state ──────────────────────────────────────────────
  const [searchText,        setSearchText]        = useState('');
  const [selectedCategory,  setSelectedCategory]  = useState('ALL');
  const [dropdownVisible,   setDropdownVisible]   = useState(false);
  const [filterModalVisible,setFilterModalVisible]= useState(false);

  // Price range — held in local state, applied on "APPLY"
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(DEFAULT_MAX);
  // Committed price range (used for actual filtering)
  const [appliedMin, setAppliedMin] = useState(0);
  const [appliedMax, setAppliedMax] = useState(DEFAULT_MAX);

  const maxPrice = useMemo(
    () => (products.length ? Math.max(...products.map((p) => p.price), DEFAULT_MAX) : DEFAULT_MAX),
    [products]
  );

  useEffect(() => {
    dispatch(loadProducts());
  }, []);

  // ── Client-side filtering (Quiz 1 — 15pts) ────────────────────
  // Filter by: search text  +  category  +  price range
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchSearch   = searchText.trim() === '' ||
        p.name.toLowerCase().includes(searchText.toLowerCase());
      const matchPrice    = p.price >= appliedMin && p.price <= appliedMax;
      return matchCategory && matchSearch && matchPrice;
    });
  }, [products, searchText, selectedCategory, appliedMin, appliedMax]);

  const isPriceFiltered = appliedMin > 0 || appliedMax < maxPrice;

  const handleApplyFilter = () => {
    setAppliedMin(priceMin);
    setAppliedMax(priceMax);
    setFilterModalVisible(false);
  };

  const handleResetFilter = () => {
    setPriceMin(0);
    setPriceMax(maxPrice);
    setAppliedMin(0);
    setAppliedMax(maxPrice);
    setFilterModalVisible(false);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setDropdownVisible(false);
  };

  // ── Product card ──────────────────────────────────────────────
  const renderCard = (item) => {
    const badgeBg   = CATEGORY_COLORS[item.category]      || '#3a3a3a';
    const badgeText = CATEGORY_TEXT_COLORS[item.category] || '#ffffff';
    return (
      <TouchableOpacity
        key={item._id}
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductInfo', { product: item })}
      >
        <Image source={{ uri: item.images?.[0] }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <View style={[styles.categoryBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.categoryBadgeText, { color: badgeText }]}>{item.category}</Text>
          </View>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardPrice}>Php. {item.price?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    if (loading && products.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      );
    }
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const left  = filteredProducts[i];
      const right = filteredProducts[i + 1];
      rows.push(
        <View key={i} style={styles.row}>
          {renderCard(left)}
          {right ? renderCard(right) : <View style={styles.cardSpacer} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Top bar ── */}
          <View style={styles.topBar}>
            <Text style={styles.logo}>
              ENDUR<Text style={styles.logoA}>A</Text>
              <Text style={styles.logoC}>C</Text>
              <Text style={styles.logoE}>E</Text>
            </Text>

            {/* Category dropdown button */}
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setDropdownVisible(!dropdownVisible)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownBtnText}>{selectedCategory} </Text>
              <FontAwesomeIcon icon={faChevronDown} size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* ── Search bar + filter button ── */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="rgba(255,255,255,0.6)"
                placeholder="Search products..."
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} size={18} color="#ffffff" />
            </View>

            {/* Filter trigger */}
            <TouchableOpacity
              style={[styles.filterBtn, isPriceFiltered && styles.filterBtnActive]}
              onPress={() => {
                setPriceMin(appliedMin);
                setPriceMax(appliedMax);
                setFilterModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <FontAwesomeIcon
                icon={faSlidersH}
                size={18}
                color={isPriceFiltered ? '#010101' : '#ffffff'}
              />
            </TouchableOpacity>
          </View>

          {/* ── Active filter chips ── */}
          {(selectedCategory !== 'ALL' || isPriceFiltered) && (
            <View style={styles.activeFiltersRow}>
              {selectedCategory !== 'ALL' && (
                <TouchableOpacity
                  style={[styles.filterChip, { backgroundColor: CATEGORY_COLORS[selectedCategory] }]}
                  onPress={() => setSelectedCategory('ALL')}
                >
                  <Text style={[styles.filterChipText, { color: CATEGORY_TEXT_COLORS[selectedCategory] }]}>
                    {selectedCategory}
                  </Text>
                  <FontAwesomeIcon icon={faXmark} size={10} color={CATEGORY_TEXT_COLORS[selectedCategory]} />
                </TouchableOpacity>
              )}
              {isPriceFiltered && (
                <TouchableOpacity style={styles.filterChip} onPress={handleResetFilter}>
                  <Text style={styles.filterChipText}>
                    Php. {appliedMin.toLocaleString()} – {appliedMax.toLocaleString()}
                  </Text>
                  <FontAwesomeIcon icon={faXmark} size={10} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Section label ── */}
          <Text style={styles.sectionLabel}>
            {selectedCategory === 'ALL' ? 'All Products' : selectedCategory}
            {'  '}
            <Text style={styles.sectionCount}>({filteredProducts.length})</Text>
          </Text>

          {/* ── Product grid ── */}
          <View style={styles.gridContainer}>
            {renderGrid()}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Category dropdown overlay ── */}
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
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategorySelect(cat)}
                  style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                  activeOpacity={0.7}
                >
                  {CATEGORY_COLORS[cat] && (
                    <View style={[styles.dropdownDot, { backgroundColor: CATEGORY_COLORS[cat] }]} />
                  )}
                  <Text style={[styles.dropdownItemText, isSelected && { color: '#ffffff' }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* ── Price range filter modal (Quiz 1) ── */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.filterSheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.filterSheetTitle}>FILTER BY PRICE</Text>

            {/* Category pills (also inside filter modal) */}
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.pillsRow}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const catColor = CATEGORY_COLORS[cat];
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.pill,
                      { borderColor: catColor || '#ffffff' },
                      isActive && { backgroundColor: catColor || '#ffffff' },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isActive && { color: cat === 'CYCLING' ? '#010101' : '#ffffff' },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Price range */}
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.priceRangeDisplay}>
              <Text style={styles.priceRangeText}>Php. {priceMin.toLocaleString()}</Text>
              <Text style={styles.priceRangeSep}>–</Text>
              <Text style={styles.priceRangeText}>Php. {priceMax.toLocaleString()}</Text>
            </View>

            <Text style={styles.sliderSubLabel}>Minimum</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={maxPrice}
              step={500}
              value={priceMin}
              onValueChange={(v) => {
                if (v <= priceMax) setPriceMin(v);
              }}
              minimumTrackTintColor="#38b6ff"
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#38b6ff"
            />

            <Text style={styles.sliderSubLabel}>Maximum</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={maxPrice}
              step={500}
              value={priceMax}
              onValueChange={(v) => {
                if (v >= priceMin) setPriceMax(v);
              }}
              minimumTrackTintColor="#ffde59"
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#ffde59"
            />

            <View style={styles.filterBtnRow}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleResetFilter}>
                <Text style={styles.resetBtnText}>RESET</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilter}>
                <Text style={styles.applyBtnText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Landing" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg:      { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  safeArea:{ flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  centered:{ alignItems: 'center', paddingTop: 60 },
  emptyText:{ fontFamily: 'Montserrat_400Regular', color: 'rgba(255,255,255,0.6)', fontSize: 14 },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 4, paddingTop: 16, marginBottom: 10, marginHorizontal: 6,
  },
  logo:  { fontFamily: 'Oswald_700Bold', fontSize: 26, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1 },
  logoA: { color: '#ff3131' },
  logoC: { color: '#ffde59' },
  logoE: { color: '#38b6ff' },
  dropdownBtn:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, gap: 6 },
  dropdownBtnText: { fontFamily: 'Oswald_700Bold', fontSize: 20, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1 },

  // Search
  searchRow: { flexDirection: 'row', gap: 10, marginHorizontal: 6, marginBottom: 10 },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)', borderRadius: 8,
    paddingHorizontal: 14, height: 48, gap: 8,
  },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 14, fontFamily: 'Montserrat_400Regular', height: '100%' },
  filterBtn: {
    width: 48, height: 48, borderRadius: 8, borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: '#ffde59', borderColor: '#ffde59' },

  // Active filter chips
  activeFiltersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 6, marginBottom: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: 20,
  },
  filterChipText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: '#ffffff', fontWeight: '700' },

  // Section label
  sectionLabel: {
    fontFamily: 'Oswald_700Bold', fontSize: 18, fontStyle: 'italic',
    color: '#ffffff', letterSpacing: 1, marginBottom: 10, marginHorizontal: 6, paddingHorizontal: 4,
  },
  sectionCount: { fontFamily: 'Montserrat_400Regular', fontSize: 14, fontStyle: 'normal', color: 'rgba(255,255,255,0.6)' },

  // Grid
  gridContainer: { width: '100%' },
  row:           { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  cardSpacer:    { width: CARD_WIDTH },
  card:          { width: CARD_WIDTH, backgroundColor: '#ffffff', borderRadius: 10, overflow: 'hidden' },
  cardImage:     { width: '100%', height: CARD_WIDTH },
  cardInfo:      { padding: 10 },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 6 },
  categoryBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardName:  { fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#010101', marginBottom: 4 },
  cardPrice: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: '#3a3a3a' },

  // Category dropdown overlay
  dropdownBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 200 },
  dropdownMenu: {
    position: 'absolute', top: 72, right: 16,
    backgroundColor: '#1e1e1e', borderRadius: 8, paddingVertical: 6,
    minWidth: 170, zIndex: 201, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  dropdownItem:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, gap: 10 },
  dropdownItemActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  dropdownDot:        { width: 10, height: 10, borderRadius: 5 },
  dropdownItemText:   { fontFamily: 'Oswald_700Bold', fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },

  // Filter bottom sheet
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  filterSheet: {
    backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40,
  },
  filterSheetTitle: {
    fontFamily: 'Oswald_700Bold', fontSize: 20, fontStyle: 'italic',
    color: '#ffffff', letterSpacing: 1, textAlign: 'center', marginBottom: 20,
  },
  filterLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 10, marginTop: 6 },

  // Category pills inside filter sheet
  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: '#ffffff', backgroundColor: 'transparent' },
  pillText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, fontWeight: '700', color: '#ffffff' },

  // Price range
  priceRangeDisplay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 },
  priceRangeText:    { fontFamily: 'Montserrat_700Bold', fontSize: 15, fontWeight: '700', color: '#ffffff' },
  priceRangeSep:     { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  sliderSubLabel:    { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  slider:            { width: '100%', height: 40 },

  filterBtnRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  resetBtn: { flex: 1, backgroundColor: '#3a3a3a', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center' },
  resetBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
  applyBtn: { flex: 1, backgroundColor: '#ffffff', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#010101', fontWeight: '700', letterSpacing: 1 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});

export default LandingPageScreen;