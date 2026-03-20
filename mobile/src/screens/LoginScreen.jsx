import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AuthHeader from '../components/AuthHeader';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772175765/4569b7cf-0df7-497e-81b4-dabc333985fc.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    navigation.navigate('Main', { screen: 'Landing' });
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <View style={styles.headerArea}>
              <AuthHeader title="LOGIN" />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    size={20}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleLogin}
                activeOpacity={0.85}
              >
                <Text style={styles.submitText}>LOG IN</Text>
              </TouchableOpacity>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Dont have an Account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                >
                  <Text style={styles.switchLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>EndurACE.</Text>
              <Text style={styles.footerText}>All Rights Reserved @ 2026.</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerArea: {
    marginTop: 80,
    marginBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 30,
    flex: 1,
  },
  label: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#3a3a3a',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    height: 56,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 15,
  },
  passwordWrapper: {
    flexDirection: 'row',
    backgroundColor: '#3a3a3a',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    height: 56,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  eyeBtn: {
    padding: 14,
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 20,
  },
  submitText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: '#010101',
    letterSpacing: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#cccccc',
    fontSize: 14,
  },
  switchLink: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffde59',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 40,
  },
  footerText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#888',
    fontSize: 12,
  },
});

export default LoginScreen;