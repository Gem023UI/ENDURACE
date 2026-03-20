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
  Alert,
} from 'react-native';
import PageHeader from '../components/PageHeader';
import FooterNavigation from '../components/FooterNavigation';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';
const COVER_IMAGE = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772174858/8fa956f5-bbb2-4ebc-9e0f-40a1cc870652.png';

const AVATAR = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772184003/065e1882-4dfa-4881-bb9c-3de4b0332025.png';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Tadej',
    lastName: 'Pogacar',
    email: 'tadejpogacar@gmail.com',
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);

  const [editFirstName, setEditFirstName] = useState(userInfo.firstName);
  const [editLastName, setEditLastName] = useState(userInfo.lastName);
  const [editEmail, setEditEmail] = useState(userInfo.email);

  const handleSaveEdit = () => {
    setUserInfo({ firstName: editFirstName, lastName: editLastName, email: editEmail });
    setEditModalVisible(false);
  };

  const handleDeactivate = () => {
    setDeactivateModalVisible(false);
    navigation.navigate('FrontPage');
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <PageHeader title="PROFILE" />

        <ScrollView contentContainerStyle={styles.content}>
          {/* Profile Card */}
          <View style={styles.card}>
            {/* Cover Photo */}
            <Image source={{ uri: COVER_IMAGE }} style={styles.coverImage} />

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://ui-avatars.com/api/?name=Tadej+Pogacar&background=38b6ff&color=fff&size=200' }}
                style={styles.avatar}
              />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoHalf}>
                <Text style={styles.infoLabel}>First Name</Text>
                <Text style={styles.infoValue}>{userInfo.firstName}</Text>
              </View>
              <View style={styles.infoHalf}>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>{userInfo.lastName}</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValueLarge}>{userInfo.email}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditFirstName(userInfo.firstName);
                  setEditLastName(userInfo.lastName);
                  setEditEmail(userInfo.email);
                  setEditModalVisible(true);
                }}
                activeOpacity={0.85}
              >
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
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Footer */}
      <View style={styles.footer}>
        <FooterNavigation navigation={navigation} activeScreen="Profile" />
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>EDIT PROFILE</Text>

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
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEdit}>
                <Text style={styles.modalSaveText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deactivate Modal */}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width, height },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  safeArea: { flex: 1 },
  content: { paddingBottom: 100 },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  coverImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: -55,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    overflow: 'hidden',
    elevation: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoHalf: {
    flex: 1,
    paddingLeft: 10,
  },
  infoBlock: {
    paddingLeft: 10,
    marginBottom: 24,
  },
  infoLabel: {
    fontFamily:'Montserrat_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoValueLarge: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  editBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#010101',
    letterSpacing: 1,
  },
  deactivateBtn: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  deactivateBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 22,
    fontStyle: 'italic',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalLabel: {
    fontFamily:'Montserrat_400Regular',
    fontSize: 13,
    color: '#cccccc',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#3a3a3a',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    height: 48,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 14,
  },
  modalMessage: {
    fontFamily:'Montserrat_400Regular',
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#010101',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ProfileScreen;