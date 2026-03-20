import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBagShopping,
  faHeart,
  faHouse,
  faCartShopping,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

const FooterNavigation = ({ navigation, activeScreen }) => {
  const navItems = [
    { icon: faBagShopping, screen: 'Orders', label: 'Orders' },
    { icon: faHeart, screen: 'Wishlist', label: 'Wishlist' },
    { icon: faHouse, screen: 'Landing', label: 'Home' },
    { icon: faCartShopping, screen: 'Cart', label: 'Cart' },
    { icon: faUser, screen: 'Profile', label: 'Profile' },
  ];

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => {
        const isActive = activeScreen === item.screen;
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => handleNavigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isActive && styles.activeWrapper]}>
              <FontAwesomeIcon
                icon={item.icon}
                size={22}
                color={isActive ? '#010101' : '#ffffff'}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 16,
    elevation: 10,
    boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeWrapper: {
    backgroundColor: '#ffffff',
    width: 50,
    height: 50,
    borderRadius: 30,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 6,
  },
});

export default FooterNavigation;