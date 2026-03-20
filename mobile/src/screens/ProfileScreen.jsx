import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/PageHeader';
import FooterNavigation from '../components/FooterNavigation';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const BG_IMAGE =
  'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';
const COVER_IMAGE =
  'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png';

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, logout, deactivate } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [avatarPickerModal, setAvatarPickerModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Edit form state
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName, setEditLastName] = useState(user?.lastName || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [newAvatarUri, setNewAvatarUri] = useState(null);

  const openEditModal = () => {
    setEditFirstName(user?.firstName || '');
    setEditLastName(user?.lastName || '');
    setEditEmail(user?.email || '');
    setNewAvatarUri(null);
    setError('');
    setEditModalVisible(true);
  };

  // ── Avatar picker ─────────────────────────────────────────────
  const pickAvatarFromCamera = async () => {
    setAvatarPickerModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return setError('Camera permission required.');
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setNewAvatarUri(result.assets[0].uri);
  };

  const pickAvatarFromGallery = async () => {
    setAvatarPickerModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return setError('Gallery permission required.');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setNewAvatarUri(result.assets[0].uri);
  };

  // ── Save profile ──────────────────────────────────────────────
  const handleSaveEdit = async () => {
    setError('');
    if (!editFirstName.trim()) return setError('First name is required.');
    if (!editLastName.trim()) return setError('Last name is required.');

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('firstName', editFirstName.trim());
      formData.append('lastName', editLastName.trim());
      formData.append('email', editEmail.trim());

      if (newAvatarUri) {
        formData.append('avatar', {
          uri: newAvatarUri,
          type: 'image/jpeg',
          name: `avatar_${Date.now()}.jpg`,
        });
      }

      await updateProfile(formData);
      setEditModalVisible(false);
    } catch (e) {
      setError(e.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'FrontPage' }] });
  };

  // ── Deactivate ────────────────────────────────────────────────
  const handleDeactivate = async () => {
    try {
      await deactivate();
      setDeactivateModalVisible(false);
      navigation.reset({ index: 0, routes: [{ name: 'FrontPage' }] });
    } catch (e) {
      setError(e.message || 'Failed to deactivate account.');
      setDeactivateModalVisible(false);
    }
  };

  const avatarUri =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=38b6ff&color=fff&size=200`;

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <PageHeader title="PROFILE" />

        <ScrollView contentContainerStyle={styles.content}>
          {/* Profile Card */}
          <View style={styles.card}>
            <Image source={{ uri: COVER_IMAGE }} style={styles.coverImage} />
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoHalf}>
                <Text style={styles.infoLabel}>First Name</Text>
                <Text style={styles.infoValue}>{user?.firstName}</Text>
              </View>
              <View style={styles.infoHalf}>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>{user?.lastName}</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValueLarge}>{user?.email}</Text>
            </View>
            {user?.role === 'admin' && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.editBtn} onPress={openEditModal} activeOpacity={0.85}>
                <Text style={styles.editBtnText}>EDIT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deactivateBtn}
                onPress={() => setDeactivateModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.deactivateBtnText}>DEACTIVATE</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Text style={styles.logoutBtnText}>LOG OUT</Text>
            </TouchableOpacity>

            {/* Admin shortcut */}
            {user?.role === 'admin' && (
              <TouchableOpacity
                style={styles.adminBtn}
                onPress={() => navigation.navigate('AdminProducts')}
                activeOpacity={0.85}
              >
                <Text style={styles.adminBtnText}>MANAGE PRODUCTS</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Profile" />
      </View>

      {/* ── Edit Modal ── */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>EDIT PROFILE</Text>

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Avatar picker */}
            <TouchableOpacity
              style={styles.avatarEditRow}
              onPress={() => setAvatarPickerModal(true)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: newAvatarUri || avatarUri }}
                style={styles.modalAvatar}
              />
              <View style={styles.cameraOverlay}>
                <FontAwesomeIcon icon={faCamera} size={14} color="#ffffff" />
              </View>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            <Text style={styles.modalLabel}>First Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholderTextColor="#888"
            />

            <Text style={styles.modalLabel}>Last Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editLastName}
              onChangeText={setEditLastName}
              placeholderTextColor="#888"
            />

            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#010101" />
                ) : (
                  <Text style={styles.modalSaveText}>SAVE</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Deactivate Modal ── */}
      <Modal
        visible={deactivateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeactivateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>DEACTIVATE ACCOUNT</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to deactivate your account? This action cannot be undone.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDeactivateModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: '#ff3131' }]}
                onPress={handleDeactivate}
              >
                <Text style={styles.modalSaveText}>DEACTIVATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Avatar Source Modal ── */}
      <Modal
        visible={avatarPickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setAvatarPickerModal(false)}
      >
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={() => setAvatarPickerModal(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>CHANGE PHOTO</Text>
            <TouchableOpacity style={styles.sheetOption} onPress={pickAvatarFromCamera}>
              <Text style={styles.sheetOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetOption} onPress={pickAvatarFromGallery}>
              <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetCancel}
              onPress={() => setAvatarPickerModal(false)}
            >
              <Text style={styles.sheetCancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  safeArea: { flex: 1 },
  content: { paddingBottom: 100 },
  card: { marginHorizontal: 16, marginTop: 16, borderRadius: 12, overflow: 'visible' },
  coverImage: { width: '100%', height: 160, borderRadius: 10, resizeMode: 'cover' },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: -55,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    overflow: 'hidden',
    elevation: 6,
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  infoSection: { paddingHorizontal: 20, marginTop: 20 },
  infoRow: { flexDirection: 'row', marginBottom: 16 },
  infoHalf: { flex: 1, paddingLeft: 10 },
  infoBlock: { paddingLeft: 10, marginBottom: 16 },
  infoLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  infoValue: { fontFamily: 'Montserrat_700Bold', fontSize: 22, fontWeight: '700', color: '#ffffff' },
  infoValueLarge: { fontFamily: 'Montserrat_700Bold', fontSize: 18, fontWeight: '700', color: '#ffffff' },
  adminBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffde59',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
    marginBottom: 16,
  },
  adminBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, fontWeight: '700', color: '#010101' },
  btnRow: { flexDirection: 'row', gap: 16, marginTop: 8, marginBottom: 12 },
  editBtn: {
    flex: 1, backgroundColor: '#ffffff', paddingVertical: 16, borderRadius: 6, alignItems: 'center',
  },
  editBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#010101', letterSpacing: 1 },
  deactivateBtn: {
    flex: 1, backgroundColor: '#3a3a3a', paddingVertical: 16, borderRadius: 6, alignItems: 'center',
  },
  deactivateBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff', letterSpacing: 1 },
  logoutBtn: {
    backgroundColor: '#ff3131', paddingVertical: 16, borderRadius: 6,
    alignItems: 'center', marginBottom: 12,
  },
  logoutBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff', letterSpacing: 1 },
  adminBtn: {
    backgroundColor: '#ffde59', paddingVertical: 14, borderRadius: 6, alignItems: 'center',
  },
  adminBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#010101', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },

  // Modals
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
  },
  modalBox: { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 24, width: '100%' },
  modalTitle: {
    fontFamily: 'Oswald_700Bold', fontSize: 22, fontStyle: 'italic',
    color: '#ffffff', marginBottom: 16, textAlign: 'center', letterSpacing: 1,
  },
  errorBox: {
    backgroundColor: 'rgba(255,49,49,0.18)', borderWidth: 1, borderColor: '#ff3131',
    borderRadius: 6, padding: 10, marginBottom: 10,
  },
  errorText: { fontFamily: 'Montserrat_400Regular', color: '#ff3131', fontSize: 12 },
  avatarEditRow: { alignItems: 'center', marginBottom: 16 },
  modalAvatar: { width: 80, height: 80, borderRadius: 40 },
  cameraOverlay: {
    position: 'absolute', bottom: 24, right: '32%',
    backgroundColor: '#38b6ff', width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  changePhotoText: {
    fontFamily: 'Montserrat_400Regular', color: '#38b6ff', fontSize: 12, marginTop: 4,
  },
  modalLabel: {
    fontFamily: 'Montserrat_400Regular', fontSize: 13, color: '#cccccc', marginBottom: 6, marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#3a3a3a', borderWidth: 1, borderColor: '#555', borderRadius: 6,
    height: 48, paddingHorizontal: 14, color: '#ffffff', fontSize: 14,
  },
  modalMessage: {
    fontFamily: 'Montserrat_400Regular', fontSize: 14, color: '#cccccc',
    lineHeight: 22, textAlign: 'center', marginBottom: 20,
  },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalCancelBtn: {
    flex: 1, backgroundColor: '#3a3a3a', borderRadius: 6,
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { fontFamily: 'Montserrat_700Bold', color: '#ffffff', fontWeight: '700', fontSize: 14 },
  modalSaveBtn: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 6,
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  modalSaveText: { fontFamily: 'Montserrat_700Bold', color: '#010101', fontWeight: '700', fontSize: 14 },

  // Bottom sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#2a2a2a', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40,
  },
  sheetTitle: {
    fontFamily: 'Oswald_700Bold', fontSize: 18, fontStyle: 'italic',
    color: '#ffffff', letterSpacing: 1, marginBottom: 20, textAlign: 'center',
  },
  sheetOption: {
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sheetOptionText: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: '#ffffff', fontWeight: '700' },
  sheetCancel: {
    marginTop: 16, height: 48, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#3a3a3a', borderRadius: 6,
  },
  sheetCancelText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default ProfileScreen;