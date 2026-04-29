import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useWorkers } from '../../hooks/useWorkers'
import StarRating from '../../components/StarRating'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  COLORS, SPACING, FONT_SIZES, CATEGORIES,
} from '../../utils/constants'
import { formatPKR, getInitials } from '../../utils/formatPKR'
import { Worker, Review } from '../../types'
import { supabase } from '../../lib/supabase'

interface WorkerDetailScreenProps {
  navigation: any
  route: any
}

export default function WorkerDetailScreen({ navigation, route }: WorkerDetailScreenProps) {
  const { demoMode } = useAuth()
  const { fetchWorkerById } = useWorkers()
  const { workerId } = route.params || {}
  const [worker, setWorker] = useState<Worker | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  // Demo worker
  const demoWorker: Worker = {
    id: workerId || 'dw1',
    name: 'Muhammad Ali',
    phone: '+923001234567',
    category: 'Electrician',
    experience: 8,
    rate: 2500,
    rate_type: 'daily',
    rating: 4.7,
    total_jobs: 156,
    available: true,
    city: 'Lahore',
    area: 'Johar Town',
    language: 'en',
    verified: true,
    premium: false,
    balance: 12500,
    total_earned: 385000,
    created_at: new Date().toISOString(),
    bio: 'Expert in residential and commercial wiring. 8 years of experience with excellent track record. Specialize in new installations, repairs, and maintenance.',
  }

  const demoReviews: Review[] = [
    { id: 'r1', rating: 5, comment: 'Excellent work! Very professional and punctual.', job_id: 'j1', worker_id: 'dw1', employer_id: 'e1', employer: { name: 'Ahmed Khan' }, created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 'r2', rating: 4, comment: 'Good work, completed on time. Quality is great.', job_id: 'j2', worker_id: 'dw1', employer_id: 'e2', employer: { name: 'Sara Ahmed' }, created_at: new Date(Date.now() - 604800000).toISOString() },
    { id: 'r3', rating: 5, comment: 'Best electrician in Lahore! Highly recommend.', job_id: 'j3', worker_id: 'dw1', employer_id: 'e3', employer: { name: 'Bilal Raza' }, created_at: new Date(Date.now() - 1209600000).toISOString() },
  ]

  useEffect(() => {
    if (demoMode) {
      setWorker(demoWorker)
      setReviews(demoReviews)
      setLoading(false)
    } else if (workerId) {
      loadWorker()
    }
  }, [workerId])

  const loadWorker = async () => {
    setLoading(true)
    try {
      const [workerData, reviewsData] = await Promise.all([
        fetchWorkerById(workerId),
        supabase
          .from('reviews')
          .select('*, employer:employers(name)')
          .eq('worker_id', workerId)
          .order('created_at', { ascending: false })
          .limit(10),
      ])
      if (workerData) setWorker(workerData)
      if (reviewsData.data) setReviews(reviewsData.data as Review[])
    } catch (err) {
      console.error('Error loading worker:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!worker) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👷</Text>
          <Text style={styles.emptyTitle}>Worker Not Found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const categoryInfo = CATEGORIES.find((c) => c.name === worker.category)

  const handleBook = () => {
    navigation.navigate('PostJob', { prefillCategory: worker.category, workerId: worker.id })
  }

  const handleCall = () => {
    Linking.openURL(`tel:${worker.phone}`)
  }

  const handleToggleFavorite = async () => {
    if (demoMode) {
      setIsFavorite(!isFavorite)
      return
    }
    // Implementation uses toggleFavorite from hook
    setIsFavorite(!isFavorite)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Worker Profile</Text>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(worker.name)}</Text>
          </View>
          <Text style={styles.name}>{worker.name}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.categoryTag}>
              {categoryInfo?.icon} {worker.category}
            </Text>
            {worker.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
            {worker.premium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>⭐ Premium</Text>
              </View>
            )}
          </View>
          <Text style={styles.locationText}>
            📍 {worker.city}{worker.area ? `, ${worker.area}` : ''}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{worker.rating}</Text>
            <StarRating rating={worker.rating} size={12} />
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{worker.total_jobs}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{worker.experience}yr</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatPKR(worker.rate)}</Text>
            <Text style={styles.statLabel}>/{worker.rate_type}</Text>
          </View>
        </View>

        {/* Bio */}
        {worker.bio && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.bioText}>{worker.bio}</Text>
          </View>
        )}

        {/* Reviews */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Reviews ({reviews.length})</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerAvatarText}>
                      {getInitials(review.employer?.name || 'AN')}
                    </Text>
                  </View>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.employer?.name || 'Anonymous'}</Text>
                    <StarRating rating={review.rating} size={12} />
                  </View>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.bookBtn]}
            onPress={handleBook}
            activeOpacity={0.8}
          >
            <Text style={styles.bookBtnText}>📋 Book This Worker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.callBtn]}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Text style={styles.callBtnText}>📞 Call Worker</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  favIcon: { fontSize: 24 },
  profileSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 3, borderColor: COLORS.primaryDark,
  },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: '700' },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: COLORS.text },
  tagRow: { flexDirection: 'row', marginTop: SPACING.sm, gap: SPACING.sm, alignItems: 'center' },
  categoryTag: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, fontWeight: '500' },
  verifiedBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: COLORS.primaryDark },
  premiumBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 6 },
  premiumText: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: '#92400E' },
  locationText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.xs },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.primaryDark },
  statLabel: { fontSize: 10, color: COLORS.textLight, marginTop: 2 },
  card: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  bioText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 22 },
  noReviews: { fontSize: FONT_SIZES.md, color: COLORS.textLight, textAlign: 'center', paddingVertical: SPACING.lg },
  reviewItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  reviewerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  reviewerAvatarText: { color: COLORS.primaryDark, fontSize: 13, fontWeight: '700' },
  reviewerInfo: { flex: 1 },
  reviewerName: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text },
  reviewComment: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  actions: { marginHorizontal: SPACING.lg, gap: SPACING.md },
  actionBtn: { borderRadius: 16, paddingVertical: SPACING.lg, alignItems: 'center' },
  bookBtn: { backgroundColor: COLORS.primary, shadowColor: 'rgba(59,130,246,0.3)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4 },
  bookBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  callBtn: { backgroundColor: COLORS.success },
  callBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
})
