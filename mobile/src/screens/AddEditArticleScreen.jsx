import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ImageBackground, Dimensions, SafeAreaView, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft, faPlus, faTrash,
  faChevronUp, faChevronDown, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addArticle, editArticle } from '../store/articleSlice';
import { useAuth } from '../context/auth';
import AuthHeader from '../components/AuthHeader';

const { width, height } = Dimensions.get('window');
const BG = 'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1772704314/Untitled_design_ydxcpc.png';

const EMPTY_SECTION = { heading: '', body: '', images: [], listItems: [] };

const AdminArticleEditScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();
  const { loading } = useSelector((s) => s.articles);

  const editingArticle = route.params?.article || null;
  const isEdit = !!editingArticle;

  // ── Form state ────────────────────────────────────────────────
  const [title,         setTitle]         = useState(editingArticle?.title         || '');
  const [subtitle,      setSubtitle]      = useState(editingArticle?.subtitle      || '');
  const [author,        setAuthor]        = useState(editingArticle?.author        || 'Admin');
  const [readTime,      setReadTime]      = useState(editingArticle?.readTime      || '5 min read');
  const [featuredImage, setFeaturedImage] = useState(editingArticle?.featuredImage || '');
  const [intro,         setIntro]         = useState(editingArticle?.content?.intro || '');
  const [sections,      setSections]      = useState(
    editingArticle?.content?.sections?.length
      ? editingArticle.content.sections.map((s) => ({
          heading:   s.heading   || '',
          body:      s.body      || '',
          images:    s.images    || [],
          listItems: s.listItems || [],
        }))
      : []
  );
  const [isActive,  setIsActive]  = useState(editingArticle?.isActive ?? true);
  const [error,     setError]     = useState('');

  // Modals for adding images/list items to a section
  const [imageModal,     setImageModal]     = useState({ visible: false, sectionIdx: null, value: '' });
  const [listItemModal,  setListItemModal]  = useState({ visible: false, sectionIdx: null, value: '' });

  // ── Section helpers ───────────────────────────────────────────
  const addSection = () => setSections((prev) => [...prev, { ...EMPTY_SECTION, images: [], listItems: [] }]);

  const removeSection = (idx) => setSections((prev) => prev.filter((_, i) => i !== idx));

  const moveSection = (idx, dir) => {
    setSections((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const updateSection = (idx, field, value) => {
    setSections((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  // Images in section
  const openImageModal = (idx) => setImageModal({ visible: true, sectionIdx: idx, value: '' });
  const addImageToSection = () => {
    const { sectionIdx, value } = imageModal;
    if (!value.trim()) return;
    setSections((prev) => prev.map((s, i) =>
      i === sectionIdx ? { ...s, images: [...s.images, value.trim()] } : s
    ));
    setImageModal({ visible: false, sectionIdx: null, value: '' });
  };
  const removeImageFromSection = (sectionIdx, imgIdx) => {
    setSections((prev) => prev.map((s, i) =>
      i === sectionIdx ? { ...s, images: s.images.filter((_, ii) => ii !== imgIdx) } : s
    ));
  };

  // List items in section
  const openListItemModal = (idx) => setListItemModal({ visible: true, sectionIdx: idx, value: '' });
  const addListItemToSection = () => {
    const { sectionIdx, value } = listItemModal;
    if (!value.trim()) return;
    setSections((prev) => prev.map((s, i) =>
      i === sectionIdx ? { ...s, listItems: [...s.listItems, value.trim()] } : s
    ));
    setListItemModal({ visible: false, sectionIdx: null, value: '' });
  };
  const removeListItemFromSection = (sectionIdx, itemIdx) => {
    setSections((prev) => prev.map((s, i) =>
      i === sectionIdx ? { ...s, listItems: s.listItems.filter((_, ii) => ii !== itemIdx) } : s
    ));
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) return setError('Title is required.');

    const payload = {
      title:         title.trim(),
      subtitle:      subtitle.trim(),
      author:        author.trim() || 'Admin',
      readTime:      readTime.trim() || '5 min read',
      featuredImage: featuredImage.trim(),
      isActive,
      content: {
        intro: intro.trim(),
        sections: sections.map((s) => ({
          heading:   s.heading.trim(),
          body:      s.body.trim(),
          images:    s.images.filter(Boolean),
          listItems: s.listItems.filter(Boolean),
        })),
      },
    };

    try {
      if (isEdit) {
        await dispatch(editArticle({ id: editingArticle._id, payload, accessToken })).unwrap();
      } else {
        await dispatch(addArticle({ payload, accessToken })).unwrap();
      }
      navigation.goBack();
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Something went wrong.');
    }
  };

  return (
    <ImageBackground source={{ uri: BG }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.headerArea}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faChevronLeft} size={18} color="#ffffff" />
              </TouchableOpacity>
              <AuthHeader title={isEdit ? 'EDIT ARTICLE' : 'NEW ARTICLE'} />
            </View>

            <View style={styles.form}>
              {!!error && (
                <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
              )}

              {/* Basic fields */}
              {[
                { label: 'Title *',             value: title,         setter: setTitle,         placeholder: 'Article title' },
                { label: 'Subtitle',            value: subtitle,      setter: setSubtitle,      placeholder: 'Short description' },
                { label: 'Author',              value: author,        setter: setAuthor,         placeholder: 'Admin' },
                { label: 'Read Time',           value: readTime,      setter: setReadTime,       placeholder: '5 min read' },
                { label: 'Featured Image URL',  value: featuredImage, setter: setFeaturedImage, placeholder: 'https://...' },
              ].map(({ label, value, setter, placeholder }) => (
                <View key={label}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setter}
                    placeholderTextColor="#888"
                    placeholder={placeholder}
                  />
                </View>
              ))}

              {/* Intro */}
              <Text style={styles.label}>Introduction</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={intro}
                onChangeText={setIntro}
                placeholderTextColor="#888"
                placeholder="Opening paragraph of the article..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Active toggle */}
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.toggleBtns}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, isActive && styles.toggleBtnActive]}
                    onPress={() => setIsActive(true)}
                  >
                    <Text style={[styles.toggleBtnText, isActive && styles.toggleBtnTextActive]}>Active</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, !isActive && styles.toggleBtnInactive]}
                    onPress={() => setIsActive(false)}
                  >
                    <Text style={[styles.toggleBtnText, !isActive && { color: '#ffffff' }]}>Inactive</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── SECTIONS ── */}
              <View style={styles.sectionsDivider} />
              <View style={styles.sectionsHeader}>
                <Text style={styles.sectionsTitle}>CONTENT SECTIONS ({sections.length})</Text>
                <TouchableOpacity style={styles.addSectionBtn} onPress={addSection} activeOpacity={0.8}>
                  <FontAwesomeIcon icon={faPlus} size={14} color="#010101" />
                  <Text style={styles.addSectionText}>ADD SECTION</Text>
                </TouchableOpacity>
              </View>

              {sections.length === 0 && (
                <View style={styles.emptySections}>
                  <Text style={styles.emptySectionsText}>No sections yet. Tap "ADD SECTION" to start building the article content.</Text>
                </View>
              )}

              {sections.map((sec, idx) => (
                <View key={idx} style={styles.sectionCard}>
                  {/* Section header */}
                  <View style={styles.sectionCardHeader}>
                    <Text style={styles.sectionCardTitle}>Section {idx + 1}</Text>
                    <View style={styles.sectionCardActions}>
                      <TouchableOpacity onPress={() => moveSection(idx, -1)} disabled={idx === 0} style={styles.sectionActionBtn}>
                        <FontAwesomeIcon icon={faChevronUp} size={12} color={idx === 0 ? '#555' : '#ffffff'} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => moveSection(idx, 1)} disabled={idx === sections.length - 1} style={styles.sectionActionBtn}>
                        <FontAwesomeIcon icon={faChevronDown} size={12} color={idx === sections.length - 1 ? '#555' : '#ffffff'} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeSection(idx)} style={[styles.sectionActionBtn, { backgroundColor: '#ff3131' }]}>
                        <FontAwesomeIcon icon={faTrash} size={12} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Heading */}
                  <Text style={styles.sectionFieldLabel}>Heading</Text>
                  <TextInput
                    style={styles.sectionInput}
                    value={sec.heading}
                    onChangeText={(t) => updateSection(idx, 'heading', t)}
                    placeholderTextColor="#666"
                    placeholder="Section heading"
                  />

                  {/* Body */}
                  <Text style={styles.sectionFieldLabel}>Body Text</Text>
                  <TextInput
                    style={[styles.sectionInput, styles.sectionTextArea]}
                    value={sec.body}
                    onChangeText={(t) => updateSection(idx, 'body', t)}
                    placeholderTextColor="#666"
                    placeholder="Write the section content here..."
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />

                  {/* Images */}
                  <View style={styles.sectionSubHeader}>
                    <Text style={styles.sectionFieldLabel}>Images ({sec.images.length})</Text>
                    <TouchableOpacity style={styles.addSubBtn} onPress={() => openImageModal(idx)} activeOpacity={0.8}>
                      <FontAwesomeIcon icon={faPlus} size={11} color="#010101" />
                      <Text style={styles.addSubBtnText}>ADD URL</Text>
                    </TouchableOpacity>
                  </View>
                  {sec.images.map((img, ii) => (
                    <View key={ii} style={styles.chipRow}>
                      <Text style={styles.chipText} numberOfLines={1}>{img}</Text>
                      <TouchableOpacity onPress={() => removeImageFromSection(idx, ii)}>
                        <FontAwesomeIcon icon={faXmark} size={14} color="#ff3131" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* List items */}
                  <View style={styles.sectionSubHeader}>
                    <Text style={styles.sectionFieldLabel}>List Items ({sec.listItems.length})</Text>
                    <TouchableOpacity style={styles.addSubBtn} onPress={() => openListItemModal(idx)} activeOpacity={0.8}>
                      <FontAwesomeIcon icon={faPlus} size={11} color="#010101" />
                      <Text style={styles.addSubBtnText}>ADD ITEM</Text>
                    </TouchableOpacity>
                  </View>
                  {sec.listItems.map((item, li) => (
                    <View key={li} style={styles.chipRow}>
                      <Text style={styles.chipText} numberOfLines={2}>{item}</Text>
                      <TouchableOpacity onPress={() => removeListItemFromSection(idx, li)}>
                        <FontAwesomeIcon icon={faXmark} size={14} color="#ff3131" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}

              {/* Submit */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#010101" />
                  : <Text style={styles.submitText}>{isEdit ? 'SAVE CHANGES' : 'PUBLISH ARTICLE'}</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── Image URL Modal ── */}
      <Modal visible={imageModal.visible} transparent animationType="slide" onRequestClose={() => setImageModal({ ...imageModal, visible: false })}>
        <View style={styles.miniModalBackdrop}>
          <View style={styles.miniModal}>
            <Text style={styles.miniModalTitle}>ADD IMAGE URL</Text>
            <TextInput
              style={styles.miniModalInput}
              value={imageModal.value}
              onChangeText={(t) => setImageModal({ ...imageModal, value: t })}
              placeholderTextColor="#666"
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
            <View style={styles.miniModalBtns}>
              <TouchableOpacity style={styles.miniCancelBtn} onPress={() => setImageModal({ ...imageModal, visible: false })}>
                <Text style={styles.miniCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.miniConfirmBtn} onPress={addImageToSection}>
                <Text style={styles.miniConfirmText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── List Item Modal ── */}
      <Modal visible={listItemModal.visible} transparent animationType="slide" onRequestClose={() => setListItemModal({ ...listItemModal, visible: false })}>
        <View style={styles.miniModalBackdrop}>
          <View style={styles.miniModal}>
            <Text style={styles.miniModalTitle}>ADD LIST ITEM</Text>
            <TextInput
              style={styles.miniModalInput}
              value={listItemModal.value}
              onChangeText={(t) => setListItemModal({ ...listItemModal, value: t })}
              placeholderTextColor="#666"
              placeholder="List item text..."
              autoFocus
              multiline
            />
            <View style={styles.miniModalBtns}>
              <TouchableOpacity style={styles.miniCancelBtn} onPress={() => setListItemModal({ ...listItemModal, visible: false })}>
                <Text style={styles.miniCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.miniConfirmBtn} onPress={addListItemToSection}>
                <Text style={styles.miniConfirmText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg:      { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  safe:    { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  headerArea:    { marginTop: 20, marginBottom: 10 },
  backBtn: {
    position: 'absolute', top: 14, left: 16, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)', width: 36, height: 36,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  form: { paddingHorizontal: 20 },
  errorBox: { backgroundColor: 'rgba(255,49,49,0.2)', borderWidth: 1, borderColor: '#ff3131', borderRadius: 6, padding: 12, marginBottom: 12 },
  errorText:{ fontFamily: 'Montserrat_400Regular', color: '#ff3131', fontSize: 13 },
  label:    { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: '#ffffff', marginBottom: 7, marginTop: 14 },
  input:    { backgroundColor: '#3a3a3a', borderWidth: 1, borderColor: '#555', borderRadius: 6, height: 52, paddingHorizontal: 14, color: '#ffffff', fontSize: 14, fontFamily: 'Montserrat_400Regular' },
  textArea: { height: 110, paddingTop: 12 },
  toggleRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  toggleBtns: { flexDirection: 'row', gap: 8 },
  toggleBtn:  { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#555', backgroundColor: 'transparent' },
  toggleBtnActive:  { backgroundColor: '#38b6ff', borderColor: '#38b6ff' },
  toggleBtnInactive:{ backgroundColor: '#ff3131', borderColor: '#ff3131' },
  toggleBtnText:    { fontFamily: 'Montserrat_700Bold', fontSize: 12, fontWeight: '700', color: '#888' },
  toggleBtnTextActive: { color: '#ffffff' },

  sectionsDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 24 },
  sectionsHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionsTitle:   { fontFamily: 'Montserrat_700Bold', fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  addSectionBtn:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffde59', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addSectionText:  { fontFamily: 'Montserrat_700Bold', fontSize: 12, fontWeight: '700', color: '#010101' },
  emptySections:   { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 20, alignItems: 'center', marginBottom: 16 },
  emptySectionsText:{ fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20 },

  sectionCard: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 14, marginBottom: 16 },
  sectionCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionCardTitle:  { fontFamily: 'Oswald_700Bold', fontSize: 16, fontStyle: 'italic', color: '#ffffff' },
  sectionCardActions:{ flexDirection: 'row', gap: 6 },
  sectionActionBtn:  { width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  sectionFieldLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, marginTop: 10 },
  sectionInput:      { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#444', borderRadius: 6, height: 44, paddingHorizontal: 12, color: '#ffffff', fontSize: 14 },
  sectionTextArea:   { height: 100, paddingTop: 10 },
  sectionSubHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 6 },
  addSubBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffde59', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  addSubBtnText:     { fontFamily: 'Montserrat_700Bold', fontSize: 10, fontWeight: '700', color: '#010101' },
  chipRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 6 },
  chipText:          { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: '#cccccc', flex: 1, marginRight: 8 },

  submitBtn:  { backgroundColor: '#ffffff', borderRadius: 6, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 28, marginBottom: 20 },
  submitText: { fontFamily: 'Montserrat_700Bold', fontSize: 15, fontWeight: '700', color: '#010101', letterSpacing: 1 },

  miniModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  miniModal:         { backgroundColor: '#2a2a2a', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, paddingBottom: 40 },
  miniModalTitle:    { fontFamily: 'Oswald_700Bold', fontSize: 18, fontStyle: 'italic', color: '#ffffff', textAlign: 'center', letterSpacing: 1, marginBottom: 16 },
  miniModalInput:    { backgroundColor: '#3a3a3a', borderWidth: 1, borderColor: '#555', borderRadius: 6, height: 48, paddingHorizontal: 12, color: '#ffffff', fontSize: 14, marginBottom: 16 },
  miniModalBtns:     { flexDirection: 'row', gap: 12 },
  miniCancelBtn:     { flex: 1, backgroundColor: '#3a3a3a', borderRadius: 6, height: 46, alignItems: 'center', justifyContent: 'center' },
  miniCancelText:    { fontFamily: 'Montserrat_700Bold', color: '#ffffff', fontWeight: '700', fontSize: 14 },
  miniConfirmBtn:    { flex: 1, backgroundColor: '#ffde59', borderRadius: 6, height: 46, alignItems: 'center', justifyContent: 'center' },
  miniConfirmText:   { fontFamily: 'Montserrat_700Bold', color: '#010101', fontWeight: '700', fontSize: 14 },
});

export default AdminArticleEditScreen;