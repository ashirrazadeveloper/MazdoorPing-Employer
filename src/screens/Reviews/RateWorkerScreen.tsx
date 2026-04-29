import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import StarRating from '../../components/StarRating'
import LoadingSpinner from '../../components/LoadingSpinner'
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants'
import { supabase } from '../../lib/supabase'

interface RateWorkerScreenProps {
  navigation: any
  route?: any
}

export default function RateWorkerScreen({ navigation, route }: RateWorkerScreenProps) {
  const { employer, demoMode } = useAuth()
  const { jobId, workerId, workerName } = route?.params || {}
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating')
      return
    }

    if (demoMode) {
      Alert.alert('Success', `Thank you for rating ${workerName || 'the worker'}! ⭐`)
      navigation.goBack()
      return
    }

    if (!employer?.id || !workerId || !jobId) {
      Alert.alert('Error', 'Missing required information')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('reviews').insert({
        rating,
        comment: comment.trim() || undefined,
        job_id: jobId,
        worker_id: workerId,
        employer_id: employer.id,
      })

      if (error) throw error

      // Update worker rating
      await supabase.rpc('update_worker_rating', { worker_uuid: workerId })

      Alert.alert('Success', `Thank you for rating ${workerName || 'the worker'}! ⭐`)
      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Rate Worker</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Worker Info */}
          <View style={styles.workerInfo}>
            <View style={styles.workerAvatar}>
              <Text style={styles.workerAvatarText}>
                {workerName ? workerName.charAt(0).toUpperCase() : '👷'}
              </Text>
            </View>
            <Text style={styles.workerName}>
              {workerName || 'Worker'}
            </Text>
            <Text style={styles.workerSubtitle}>
              Rate your experience with this worker
            </Text>
          </View>

          {/* Star Rating Picker */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>How was the work?</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  onPressIn={() => setHoverRating(star)}
                  onPressOut={() => setHoverRating(0)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.star,
                      star <= (hoverRating || rating) ? styles.starActive : styles.starInactive,
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingLabel}>
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Below Average'}
                {rating === 3 && 'Average'}
                {rating === 4 && 'Good'}
                {rating === 5 && 'Excellent!'}
              </Text>
            )}
          </View>

          {/* Comment */}
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Write a Review (Optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell others about your experience..."
              placeholderTextColor={COLORS.textLight}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>

          {/* Quick Review Options */}
          <View style={styles.quickOptions}>
            <Text style={styles.quickTitle}>Quick Review</Text>
            <View style={styles.quickChips}>
              {['Punctual', 'Professional', 'Quality Work', 'Good Behavior', 'Fair Price'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.quickChip}
                  onPress={() => {
                    if (!comment.includes(tag)) {
                      setComment(comment ? `${comment}, ${tag}` : tag)
                    }
                  }}
                >
                  <Text style={styles.quickChipText}>+ {tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading || rating === 0}
            activeOpacity={0.8}
          >
            {loading ? (
              <LoadingSpinner size={24} color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                ⭐ Submit Rating ({rating}/5)
              </Text>
            )}
          </TouchableOpacity>

          {demoMode && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>
                🎮 Demo Mode — Submitting will show a success message
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  workerInfo: { alignItems: 'center', marginBottom: SPACING.xl },
  workerAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  workerAvatarText: { color: '#FFFFFF', fontSize: 32, fontWeight: '700' },
  workerName: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: COLORS.text },
  workerSubtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 4 },
  ratingSection: { alignItems: 'center', marginBottom: SPACING.xl },
  ratingTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  starsContainer: { flexDirection: 'row', gap: SPACING.lg },
  star: { fontSize: 48 },
  starActive: { color: '#F59E0B' },
  starInactive: { color: COLORS.border },
  ratingLabel: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.primary, marginTop: SPACING.md },
  commentSection: { marginBottom: SPACING.lg },
  commentTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  commentInput: { backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, fontSize: FONT_SIZES.md, color: COLORS.text, borderWidth: 1.5, borderColor: COLORS.border, height: 120 },
  charCount: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, textAlign: 'right', marginTop: SPACING.xs },
  quickOptions: { marginBottom: SPACING.lg },
  quickTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  quickChips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  quickChip: { backgroundColor: COLORS.borderLight, borderRadius: 16, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  quickChipText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textSecondary },
  submitBtn: { backgroundColor: '#F59E0B', borderRadius: 16, paddingVertical: SPACING.lg, alignItems: 'center', shadowColor: 'rgba(245,158,11,0.3)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  demoNotice: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  demoNoticeText: { fontSize: FONT_SIZES.sm, color: '#92400E', fontWeight: '600' },
})
