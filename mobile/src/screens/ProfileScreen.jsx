import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ImageBackground, Dimensions, SafeAreaView, Modal,
  TextInput, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faChevronRight, faGoogle, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGoogle as fabGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/auth';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');
const BG = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';
const COVER = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png';

const GOOGLE_CLIENT_ID  = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID  || 'YOUR_GOOGLE_CLIENT_ID';
const FACEBOOK_APP_ID   = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID   || 'YOUR_FACEBOOK_APP_ID';

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, logout, deactivate, loginWithGoogle, loginWithFacebook, accessToken } = useAuth();

  const [editModalVisible,       setEditModalVisible]       = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [avatarPickerModal,      setAvatarPickerModal]      = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName,  setEditLastName]  = useState(user?.lastName  || '');
  const [editEmail,     setEditEmail]     = useState(user?.email     || '');
  const [newAvatarUri,  setNewAvatarUri]  = useState(null);

  // ── OAuth hooks for account linking ──────────────────────────────
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID, iosClientId: GOOGLE_CLIENT_ID, androidClientId: GOOGLE_CLIENT_ID,
  });
  const [, fbResponse, promptFacebookAsync] = Facebook.useAuthRequest({ clientId: FACEBOOK_APP_ID });

  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleLink(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  React.useEffect(() => {
    if (fbResponse?.type === 'success') {
      handleFacebookLink(fbResponse.authentication.accessToken);
    }
  }, [fbResponse]);

  const handleGoogleLink = async (googleAccessToken) => {
    try {
      const userInfoRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
      });
      const userInfo = await userInfoRes.json();
      await loginWithGoogle({
        googleId: userInfo.id, email: userInfo.email,
        firstName: userInfo.given_name || '', lastName: userInfo.family_name || '',
        avatar: userInfo.picture || '',
      });
      Alert.alert('Success', 'Google account linked successfully!');
    } catch (e) { Alert.alert('Error', e.message || 'Failed to link Google account'); }
  };

  const handleFacebookLink = async (fbAccessToken) => {
    try {
      const userInfoRes = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${fbAccessToken}`
      );
      const userInfo = await userInfoRes.json();
      const [fn, ...rest] = (userInfo.name || '').split(' ');
      await loginWithFacebook({
        facebookId: userInfo.id, email: userInfo.email || '',
        firstName: fn, lastName: rest.join(' '),
        avatar: userInfo.picture?.data?.url || '',
      });
      Alert.alert('Success', 'Facebook account linked successfully!');
    } catch (e) { Alert.alert('Error', e.message || 'Failed to link Facebook account'); }
  };

  const openEditModal = () => {
    setEditFirstName(user?.firstName || '');
    setEditLastName(user?.lastName   || '');
    setEditEmail(user?.email         || '');
    setNewAvatarUri(null);
    setError('');
    setEditModalVisible(true);
  };

  // ── Avatar picker ─────────────────────────────────────────────
  const pickFromCamera = async () => {
    setAvatarPickerModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return setError('Camera permission required.');
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8, allowsEditing: true, aspect: [1, 1],
    });
    if (!result.canceled) setNewAvatarUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    setAvatarPickerModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return setError('Gallery permission required.');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8, allowsEditing: true, aspect: [1, 1],
    });
    if (!result.canceled) setNewAvatarUri(result.assets[0].uri);
  };

  // ── Save profile ──────────────────────────────────────────────
  const handleSaveEdit = async () => {
    setError('');
    if (!editFirstName.trim()) return setError('First name is required.');
    if (!editLastName.trim())  return setError('Last name is required.');
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('firstName', editFirstName.trim());
      formData.append('lastName',  editLastName.trim());
      formData.append('email',     editEmail.trim());

      if (newAvatarUri) {
        // Get file extension
        const ext  = newAvatarUri.split('.').pop()?.toLowerCase() || 'jpg';
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        formData.append('avatar', {
          uri:  newAvatarUri,
          type: mime,
          name: `avatar_${Date.now()}.${ext}`,
        });
      }

      await updateProfile(formData);
      setEditModalVisible(false);
      setNewAvatarUri(null);
    } catch (e) {
      setError(e.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'FrontPage' }] });
  };

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
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.firstName || ''} ${user?.lastName || ''}`
    )}&background=38b6ff&color=fff&size=200`;

  const isAdmin = user?.role === 'admin';
  const hasGoogle   = !!user?.googleId   || user?.authProvider === 'google';
  const hasFacebook = !!user?.facebookId || user?.authProvider === 'facebook';

  return (
    <ImageBackground source={{ uri: BG }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <PageHeader title="PROFILE" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* ── Cover + Avatar ── */}
          <View style={styles.card}>
            <Image source={{ uri: COVER }} style={styles.coverImage} />
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: newAvatarUri || avatarUri }} style={styles.avatar} />
            </View>
          </View>

          {/* ── User info ── */}
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
            {isAdmin && (
              <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>ADMIN</Text></View>
            )}

            {/* ── Action buttons ── */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.editBtn} onPress={openEditModal} activeOpacity={0.85}>
                <Text style={styles.editBtnText}>EDIT PROFILE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deactivateBtn} onPress={() => setDeactivateModalVisible(true)} activeOpacity={0.85}>
                <Text style={styles.deactivateBtnText}>DEACTIVATE</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Text style={styles.logoutBtnText}>LOG OUT</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ── Quick links ── */}
            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('MyReviews')} activeOpacity={0.8}>
              <Text style={styles.linkLabel}>My Reviews</Text>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Orders')} activeOpacity={0.8}>
              <Text style={styles.linkLabel}>My Orders</Text>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            {/* ── Connected accounts ── */}
            <Text style={styles.sectionTitle}>CONNECTED ACCOUNTS</Text>
            <View style={styles.connectedRow}>
              <View style={styles.connectedLeft}>
                <View style={[styles.connectedIcon, { backgroundColor: '#DB4437' }]}>
                  <FontAwesomeIcon icon={fabGoogle} size={16} color="#ffffff" />
                </View>
                <View>
                  <Text style={styles.connectedLabel}>Google</Text>
                  <Text style={styles.connectedStatus}>{hasGoogle ? 'Connected' : 'Not connected'}</Text>
                </View>
              </View>
              {!hasGoogle && (
                <TouchableOpacity style={styles.linkAccountBtn} onPress={() => promptGoogleAsync()} activeOpacity={0.8}>
                  <FontAwesomeIcon icon={faLink} size={12} color="#010101" />
                  <Text style={styles.linkAccountText}>LINK</Text>
                </TouchableOpacity>
              )}
              {hasGoogle && <View style={styles.connectedBadge}><Text style={styles.connectedBadgeText}>✓</Text></View>}
            </View>

            <View style={styles.connectedRow}>
              <View style={styles.connectedLeft}>
                <View style={[styles.connectedIcon, { backgroundColor: '#1877F2' }]}>
                  <FontAwesomeIcon icon={faFacebook} size={16} color="#ffffff" />
                </View>
                <View>
                  <Text style={styles.connectedLabel}>Facebook</Text>
                  <Text style={styles.connectedStatus}>{hasFacebook ? 'Connected' : 'Not connected'}</Text>
                </View>
              </View>
              {!hasFacebook && (
                <TouchableOpacity style={styles.linkAccountBtn} onPress={() => promptFacebookAsync()} activeOpacity={0.8}>
                  <FontAwesomeIcon icon={faLink} size={12} color="#010101" />
                  <Text style={styles.linkAccountText}>LINK</Text>
                </TouchableOpacity>
              )}
              {hasFacebook && <View style={styles.connectedBadge}><Text style={styles.connectedBadgeText}>✓</Text></View>}
            </View>

            {/* ── Admin panel shortcuts ── */}
            {isAdmin && (
              <>
                <View style={styles.sectionDivider} />
                <Text style={styles.sectionTitle}>ADMIN PANEL</Text>
                <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminDashboard')} activeOpacity={0.85}>
                  <Text style={styles.adminBtnText}>OPEN DASHBOARD</Text>
                  <FontAwesomeIcon icon={faChevronRight} size={14} color="#010101" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Edit Profile Modal ── */}
      <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>EDIT PROFILE</Text>
              {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

              {/* Avatar picker */}
              <TouchableOpacity style={styles.avatarEditRow} onPress={() => setAvatarPickerModal(true)} activeOpacity={0.8}>
                <Image source={{ uri: newAvatarUri || avatarUri }} style={styles.modalAvatar} />
                <View style={styles.cameraOverlay}>
                  <FontAwesomeIcon icon={faCamera} size={14} color="#ffffff" />
                </View>
                <Text style={styles.changePhotoText}>
                  {newAvatarUri ? 'Photo selected ✓' : 'Change Photo'}
                </Text>
              </TouchableOpacity>

              {[
                { label: 'First Name', value: editFirstName, setter: setEditFirstName },
                { label: 'Last Name',  value: editLastName,  setter: setEditLastName  },
                { label: 'Email',      value: editEmail,     setter: setEditEmail, keyboard: 'email-address' },
              ].map(({ label, value, setter, keyboard }) => (
                <View key={label}>
                  <Text style={styles.modalLabel}>{label}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={value}
                    onChangeText={setter}
                    keyboardType={keyboard || 'default'}
                    autoCapitalize={keyboard ? 'none' : 'words'}
                    placeholderTextColor="#888"
                  />
                </View>
              ))}

              <View style={styles.modalBtnRow}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalCancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEdit} disabled={saving}>
                  {saving ? <ActivityIndicator color="#010101" /> : <Text style={styles.modalSaveText}>SAVE</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ── Deactivate Modal ── */}
      <Modal visible={deactivateModalVisible} transparent animationType="fade" onRequestClose={() => setDeactivateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { marginHorizontal: 24 }]}>
            <Text style={styles.modalTitle}>DEACTIVATE ACCOUNT</Text>
            <Text style={styles.modalMessage}>Are you sure? This action cannot be undone.</Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setDeactivateModalVisible(false)}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSaveBtn, { backgroundColor: '#ff3131' }]} onPress={handleDeactivate}>
                <Text style={[styles.modalSaveText, { color: '#ffffff' }]}>DEACTIVATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Avatar Source Sheet ── */}
      <Modal visible={avatarPickerModal} transparent animationType="slide" onRequestClose={() => setAvatarPickerModal(false)}>
        <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setAvatarPickerModal(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>CHANGE PHOTO</Text>
            <TouchableOpacity style={styles.sheetOption} onPress={pickFromCamera}>
              <Text style={styles.sheetOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetOption} onPress={pickFromGallery}>
              <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetCancel} onPress={() => setAvatarPickerModal(false)}>
              <Text style={styles.sheetCancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg:      { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  safe:    { flex: 1 },
  content: { paddingBottom: 110 },
  card:         { marginHorizontal: 16, marginTop: 16, borderRadius: 12, overflow: 'visible' },
  coverImage:   { width: '100%', height: 160, borderRadius: 10, resizeMode: 'cover' },
  avatarWrapper:{ alignSelf: 'center', marginTop: -55, borderRadius: 60, borderWidth: 4, borderColor: '#ffffff', overflow: 'hidden', elevation: 6 },
  avatar:       { width: 110, height: 110, borderRadius: 55 },
  infoSection:  { paddingHorizontal: 20, marginTop: 20 },
  infoRow:      { flexDirection: 'row', marginBottom: 16 },
  infoHalf:     { flex: 1, paddingLeft: 10 },
  infoBlock:    { paddingLeft: 10, marginBottom: 16 },
  infoLabel:    { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  infoValue:    { fontFamily: 'Montserrat_700Bold', fontSize: 22, fontWeight: '700', color: '#ffffff' },
  infoValueLarge:{ fontFamily: 'Montserrat_700Bold', fontSize: 18, fontWeight: '700', color: '#ffffff' },
  adminBadge:   { alignSelf: 'flex-start', backgroundColor: '#ffde59', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginLeft: 10, marginBottom: 16 },
  adminBadgeText:{ fontFamily: 'Montserrat_700Bold', fontSize: 11, fontWeight: '700', color: '#010101' },
  btnRow:       { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12 },
  editBtn:      { flex: 1, backgroundColor: '#ffffff', paddingVertical: 16, borderRadius: 6, alignItems: 'center' },
  editBtnText:  { fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#010101', letterSpacing: 1 },
  deactivateBtn:{ flex: 1, backgroundColor: '#3a3a3a', paddingVertical: 16, borderRadius: 6, alignItems: 'center' },
  deactivateBtnText:{ fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#ffffff', letterSpacing: 1 },
  logoutBtn:    { backgroundColor: '#ff3131', paddingVertical: 16, borderRadius: 6, alignItems: 'center', marginBottom: 12 },
  logoutBtnText:{ fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff', letterSpacing: 1 },
  sectionDivider:{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, marginBottom: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  linkLabel:{ fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff' },
  connectedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  connectedLeft:{ flexDirection: 'row', alignItems: 'center', gap: 12 },
  connectedIcon:{ width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  connectedLabel:{ fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff' },
  connectedStatus:{ fontFamily: 'Montserrat_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  linkAccountBtn:{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffde59', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  linkAccountText:{ fontFamily: 'Montserrat_700Bold', fontSize: 11, fontWeight: '700', color: '#010101' },
  connectedBadge:{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#38b6ff', alignItems: 'center', justifyContent: 'center' },
  connectedBadgeText:{ fontFamily: 'Montserrat_700Bold', fontSize: 14, fontWeight: '700', color: '#ffffff' },
  adminBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffde59', paddingVertical: 15, paddingHorizontal: 16, borderRadius: 6, marginBottom: 10 },
  adminBtnText:{ fontFamily: 'Montserrat_700Bold', fontSize: 13, fontWeight: '700', color: '#010101', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' },
  modalBox:     { backgroundColor: '#2a2a2a', borderRadius: 12, padding: 24 },
  modalTitle:   { fontFamily: 'Oswald_700Bold', fontSize: 22, fontStyle: 'italic', color: '#ffffff', marginBottom: 16, textAlign: 'center', letterSpacing: 1 },
  errorBox:     { backgroundColor: 'rgba(255,49,49,0.18)', borderWidth: 1, borderColor: '#ff3131', borderRadius: 6, padding: 10, marginBottom: 10 },
  errorText:    { fontFamily: 'Montserrat_400Regular', color: '#ff3131', fontSize: 12 },
  avatarEditRow:{ alignItems: 'center', marginBottom: 16 },
  modalAvatar:  { width: 80, height: 80, borderRadius: 40 },
  cameraOverlay:{ position: 'absolute', bottom: 24, right: '32%', backgroundColor: '#38b6ff', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  changePhotoText:{ fontFamily: 'Montserrat_400Regular', color: '#38b6ff', fontSize: 12, marginTop: 4 },
  modalLabel:   { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: '#cccccc', marginBottom: 6, marginTop: 10 },
  modalInput:   { backgroundColor: '#3a3a3a', borderWidth: 1, borderColor: '#555', borderRadius: 6, height: 48, paddingHorizontal: 14, color: '#ffffff', fontSize: 14 },
  modalMessage: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: '#cccccc', lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  modalBtnRow:  { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalCancelBtn:{ flex: 1, backgroundColor: '#3a3a3a', borderRadius: 6, height: 48, alignItems: 'center', justifyContent: 'center' },
  modalCancelText:{ fontFamily: 'Montserrat_700Bold', color: '#ffffff', fontWeight: '700', fontSize: 14 },
  modalSaveBtn: { flex: 1, backgroundColor: '#ffffff', borderRadius: 6, height: 48, alignItems: 'center', justifyContent: 'center' },
  modalSaveText:{ fontFamily: 'Montserrat_700Bold', color: '#010101', fontWeight: '700', fontSize: 14 },
  sheetBackdrop:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#2a2a2a', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  sheetTitle:   { fontFamily: 'Oswald_700Bold', fontSize: 18, fontStyle: 'italic', color: '#ffffff', letterSpacing: 1, marginBottom: 20, textAlign: 'center' },
  sheetOption:  { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  sheetOptionText:{ fontFamily: 'Montserrat_700Bold', fontSize: 15, color: '#ffffff', fontWeight: '700' },
  sheetCancel:  { marginTop: 16, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3a3a3a', borderRadius: 6 },
  sheetCancelText:{ fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#ffffff', fontWeight: '700' },
});

export default ProfileScreen;