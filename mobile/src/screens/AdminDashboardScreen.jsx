import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ImageBackground, Dimensions, SafeAreaView, ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBoxOpen, faClipboardList, faTag,
  faNewspaper, faChevronRight, faBars,
} from '@fortawesome/free-solid-svg-icons';
import { DrawerActions } from '@react-navigation/native';
import { useAuth } from '../context/auth';

const { width, height } = Dimensions.get('window');
const BG = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const ADMIN_SECTIONS = [
  { label: 'Manage Products', icon: faBoxOpen,       screen: 'AdminProducts',  color: '#ffde59', textColor: '#010101' },
  { label: 'Manage Orders',   icon: faClipboardList,  screen: 'AdminOrders',    color: '#38b6ff', textColor: '#ffffff' },
  { label: 'Discounts',       icon: faTag,            screen: 'AdminDiscounts', color: '#ff3131', textColor: '#ffffff' },
  { label: 'Articles',        icon: faNewspaper,      screen: 'AdminArticles',  color: '#ffffff', textColor: '#010101' },
];

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ImageBackground source={{ uri: BG }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            activeOpacity={0.8}
          >
            <FontAwesomeIcon icon={faBars} size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.logo}>
              ENDUR<Text style={styles.logoA}>A</Text>
              <Text style={styles.logoC}>C</Text>
              <Text style={styles.logoE}>E</Text>
            </Text>
            <Text style={styles.adminLabel}>ADMIN PANEL</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Welcome */}
          <View style={styles.welcomeBlock}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{user?.firstName} {user?.lastName}</Text>
          </View>

          {/* Stripe */}
          <View style={styles.stripeRow}>
            <View style={[styles.stripe, { backgroundColor: '#ff3131' }]} />
            <View style={[styles.stripe, { backgroundColor: '#ffde59' }]} />
            <View style={[styles.stripe, { backgroundColor: '#38b6ff' }]} />
          </View>

          <Text style={styles.sectionLabel}>MANAGEMENT</Text>

          {ADMIN_SECTIONS.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.85}
            >
              <View style={[styles.cardIcon, { backgroundColor: 'rgba(0,0,0,0.12)' }]}>
                <FontAwesomeIcon icon={item.icon} size={22} color={item.textColor} />
              </View>
              <Text style={[styles.cardLabel, { color: item.textColor }]}>{item.label}</Text>
              <FontAwesomeIcon icon={faChevronRight} size={14} color={item.textColor} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg:      { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  safe:    { flex: 1 },
  header:  {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12,
  },
  menuBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1 },
  logo:         { fontFamily: 'Oswald_700Bold', fontSize: 24, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1 },
  logoA:        { color: '#ff3131' },
  logoC:        { color: '#ffde59' },
  logoE:        { color: '#38b6ff' },
  adminLabel:   { fontFamily: 'Montserrat_700Bold', fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  content:      { paddingHorizontal: 20, paddingBottom: 40 },
  welcomeBlock: { paddingVertical: 20 },
  welcomeText:  { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  welcomeName:  { fontFamily: 'Oswald_700Bold', fontSize: 28, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1 },
  stripeRow:    { height: 4, flexDirection: 'row', borderRadius: 2, overflow: 'hidden', marginBottom: 24 },
  stripe:       { flex: 1 },
  sectionLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: 12, marginBottom: 12,
  },
  cardIcon:  { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { flex: 1, fontFamily: 'Montserrat_700Bold', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});

export default AdminDashboardScreen;