import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, editReview } from '../store/reviewSlice';
import { useAuth } from '../context/AuthContext';
import StarRatingInput from './StarRatingInput';

/**
 * ReviewFormModal
 * Props:
 *   visible      {boolean}
 *   onClose      {function}
 *   productId    {string}
 *   existingReview {object|null}  pass to enable edit mode
 */
const ReviewFormModal = ({ visible, onClose, productId, existingReview = null }) => {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();
  const { loading, error } = useSelector((state) => state.reviews);

  const isEdit = !!existingReview;

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [localError, setLocalError] = useState('');

  // Re-seed form when existingReview changes (e.g. user opens edit modal)
  useEffect(() => {
    setRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || '');
    setLocalError('');
  }, [existingReview, visible]);

  const handleSubmit = async () => {
    setLocalError('');
    if (!rating) return setLocalError('Please select a star rating.');
    if (!comment.trim()) return setLocalError('Please write a comment.');
    if (comment.trim().length < 10)
      return setLocalError('Comment must be at least 10 characters.');

    try {
      if (isEdit) {
        await dispatch(
          editReview({
            reviewId: existingReview._id,
            productId,
            rating,
            comment: comment.trim(),
            accessToken,
          })
        ).unwrap();
      } else {
        await dispatch(
          submitReview({ productId, rating, comment: comment.trim(), accessToken })
        ).unwrap();
      }
      onClose();
    } catch (e) {
      setLocalError(e || 'Something went wrong. Please try again.');
    }
  };

  const displayError = localError || error;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {isEdit ? 'EDIT REVIEW' : 'WRITE A REVIEW'}
          </Text>

          {!!displayError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          {/* Star selector */}
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.starRow}>
            <StarRatingInput rating={rating} onChange={setRating} size={32} />
          </View>

          {/* Comment */}
          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={styles.textArea}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience with this product..."
            placeholderTextColor="#777"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.charCount}>{comment.length}/1000</Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#010101" />
              ) : (
                <Text style={styles.submitText}>
                  {isEdit ? 'SAVE' : 'SUBMIT'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 20,
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: 'rgba(255,49,49,0.15)',
    borderWidth: 1,
    borderColor: '#ff3131',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#ff3131',
    fontSize: 12,
  },
  label: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    marginTop: 12,
  },
  starRow: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  textArea: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    minHeight: 110,
    lineHeight: 20,
  },
  charCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#010101',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ReviewFormModal;