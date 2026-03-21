import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faCartShopping,
  faHeart,
  faBagShopping,
  faUser,
  faStar,
  faRightFromBracket,
  faBoxOpen,
  faClipboardList,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/auth';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { label: 'Home',       screen: 'Landing',   icon: faHouse },
  { label: 'Cart',       screen: 'Cart',       icon: faCartShopping },
  { label: 'Wishlist',   screen: 'Wishlist',   icon: faHeart },
  { label: 'My Orders',  screen: 'Orders',     icon: faBagShopping },
  { label: 'My Reviews', screen: 'MyReviews',  icon: faStar },
  { label: 'Profile',    screen: 'Profile',    icon: faUser },
];

const ADMIN_ITEMS = [
  { label: 'Manage Products', screen: 'AdminProducts',  icon: faBoxOpen },
  { label: 'Manage Orders',   screen: 'AdminOrders',    icon: faClipboardList },
  { label: 'Discounts',       screen: 'AdminDiscounts', icon: faTag },
];

const DrawerContent = (props) => {
  const { navigation, state } = props;
  const { user, logout } = useAuth();

  const activeRouteName = state.routes[state.index]?.name;

  const isAdmin = user?.role === 'admin';

  const avatarUri =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.firstName || ''} ${user?.lastName || ''}`
    )}&background=38b6ff&color=fff&size=200`;

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'FrontPage' }] });
  };

  const navigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Stripe bar */}
        <View style={styles.stripeRow}>
          <View style={[styles.stripe, { backgroundColor: '#ff3131' }]} />
          <View style={[styles.stripe, { backgroundColor: '#ffde59' }]} />
          <View style={[styles.stripe, { backgroundColor: '#38b6ff' }]} />
        </View>

        {/* Logo */}
        <Text style={styles.logo}>
          ENDUR<Text style={styles.logoA}>A</Text>
          <Text style={styles.logoC}>C</Text>
          <Text style={styles.logoE}>E</Text>
        </Text>

        {/* Avatar + name */}
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => navigate('Profile')}
          activeOpacity={0.8}
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email}
            </Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Nav Items ── */}
      <DrawerContentScrollView
        {...props}
        scrollEnabled
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>MENU</Text>

        {NAV_ITEMS.map((item) => {
          const isActive = activeRouteName === item.screen;
          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigate(item.screen)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <FontAwesomeIcon
                  icon={item.icon}
                  size={18}
                  color={isActive ? '#010101' : '#ffffff'}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}

        {/* ── Admin Section ── */}
        {isAdmin && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>ADMIN PANEL</Text>

            {ADMIN_ITEMS.map((item) => {
              const isActive = activeRouteName === item.screen;
              return (
                <TouchableOpacity
                  key={item.screen}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => navigate(item.screen)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.iconWrap, isActive && styles.iconWrapActive, { backgroundColor: isActive ? '#ffde59' : 'rgba(255,222,89,0.15)' }]}>
                    <FontAwesomeIcon
                      icon={item.icon}
                      size={18}
                      color={isActive ? '#010101' : '#ffde59'}
                    />
                  </View>
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activeBar} />}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </DrawerContentScrollView>

      {/* ── Footer: Logout ── */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <FontAwesomeIcon icon={faRightFromBracket} size={18} color="#ff3131" />
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>EndurACE © 2026</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121212',
  },

  // Header
  header: {
    paddingBottom: 16,
    backgroundColor: '#1a1a1a',
  },
  stripeRow: {
    height: 5,
    flexDirection: 'row',
  },
  stripe: { flex: 1 },
  logo: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    marginBottom: 16,
  },
  logoA: { color: '#ff3131' },
  logoC: { color: '#ffde59' },
  logoE: { color: '#38b6ff' },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#38b6ff',
  },
  userInfo: { flex: 1 },
  userName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  adminBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffde59',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    fontWeight: '700',
    color: '#010101',
    letterSpacing: 0.5,
  },

  // Scroll area
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 6,
  },

  // Nav item
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 10,
    gap: 14,
    position: 'relative',
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#ffffff',
  },
  navLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  navLabelActive: {
    color: '#ffffff',
  },
  activeBar: {
    width: 4,
    height: 24,
    backgroundColor: '#38b6ff',
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
    marginVertical: 12,
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: '#121212',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  logoutText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#ff3131',
    letterSpacing: 0.5,
  },
  footerNote: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default DrawerContent;