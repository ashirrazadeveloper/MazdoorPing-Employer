import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useJobs } from '../../hooks/useJobs'
import StarRating from '../../components/StarRating'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  COLORS, SPACING, FONT_SIZES, CATEGORIES,
  JOB_STATUS_COLORS, JOB_STATUS_LABELS,
} from '../../utils/constants'
import { formatPKR, formatDateFull, getInitials } from '../../utils/formatPKR'
import { Job } from '../../types'

interface JobDetailScreenProps {
  navigation: any
  route: any
}

export default function JobDetailScreen({ navigation, route }: JobDetailScreenProps) {
  const { employer, demoMode } = useAuth()
  const { fetchJobById, cancelJob, loading } = useJobs()
  const { jobId } = route.params || {}
  const [job, setJob] = useState<Job | null>(null)

  // Demo job
  const demoJob: Job = {
    id: jobId || 'dj1',
    title: 'Paint Living Room',
    category: 'Painter',
    description: 'Need an experienced painter to paint living room and 2 bedrooms with emulsion paint. Walls and ceiling both. Paint will be provided. Worker needs to bring own brushes and tools.',
    rate: 3500,
    rate_type: 'daily',
    status: 'completed',
    city: 'Lahore',
    area: 'DHA Phase 6',
    address: 'House #42, Street 5, DHA Phase 6, Lahore',
    urgent: false,
    payment_method: 'cash',
    payment_status: 'paid',
    employer_id: 'de1',
    worker_id: 'dw2',
    worker: {
      id: 'dw2', name: 'Hassan Mehmood', phone: '+923002345678',
      category: 'Painter', experience: 5, rate: 1800, rate_type: 'daily',
      rating: 4.5, total_jobs: 89, available: true, city: 'Lahore', area: 'Gulberg',
      language: 'en', verified: true, premium: false,
      balance: 0, total_earned: 0, created_at: '',
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 43200000).toISOString(),
  }

  useEffect(() => {
    if (demoMode) {
      setJob(demoJob)
    } else if (jobId) {
      fetchJobById(jobId).then((data) => {
        if (data) setJob(data)
      })
    }
  }, [jobId])

  if (loading) return <LoadingSpinner fullScreen />
  if (!job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Job Not Found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const categoryInfo = CATEGORIES.find((c) => c.name === job.category)
  const statusColor = JOB_STATUS_COLORS[job.status]
  const statusLabel = JOB_STATUS_LABELS[job.status]
  const isPending = job.status === 'pending'

  const handleCancel = async () => {
    Alert.alert('Cancel Job', 'Are you sure you want to cancel this job?', [
      { text: 'Keep Job', style: 'cancel' },
      {
        text: 'Cancel Job',
        style: 'destructive',
        onPress: async () => {
          if (demoMode) {
            setJob({ ...job, status: 'cancelled' })
            return
          }
          const success = await cancelJob(job.id)
          if (success) {
            setJob({ ...job, status: 'cancelled' })
            Alert.alert('Cancelled', 'Job has been cancelled.')
          }
        },
      },
    ])
  }

  const handleRateWorker = () => {
    if (job.worker_id) {
      navigation.navigate('RateWorker', {
        jobId: job.id,
        workerId: job.worker_id,
        workerName: job.worker?.name || 'Worker',
      })
    }
  }

  const handleCallWorker = () => {
    if (job.worker?.phone) {
      Linking.openURL(`tel:${job.worker.phone}`)
    }
  }

  // Status timeline
  const timelineSteps = [
    { label: 'Posted', done: true, time: job.created_at },
    { label: 'Accepted', done: ['accepted', 'in_progress', 'completed'].includes(job.status), time: '' },
    { label: 'In Progress', done: ['in_progress', 'completed'].includes(job.status), time: '' },
    { label: 'Completed', done: job.status === 'completed', time: job.completed_at || '' },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>🚨 URGENT</Text>
            </View>
          )}
        </View>

        {/* Job Info */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.categoryIcon}>{categoryInfo?.icon || '📋'}</Text>
            <View style={styles.titleInfo}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.subtitle}>{job.category}</Text>
            </View>
          </View>

          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>{formatPKR(job.rate)}</Text>
            <Text style={styles.rateLabel}>/{job.rate_type} • {job.payment_method}</Text>
          </View>

          {job.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{job.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>📍 {job.area || ''}, {job.city}</Text>
            {job.address && <Text style={styles.addressText}>{job.address}</Text>}
          </View>

          <View style={styles.postedRow}>
            <Text style={styles.postedLabel}>Posted: {formatDateFull(job.created_at)}</Text>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={step.label} style={styles.timelineStep}>
                <View style={styles.timelineDotRow}>
                  <View style={[styles.timelineDot, step.done && styles.timelineDotDone]} />
                  {index < timelineSteps.length - 1 && (
                    <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                  )}
                </View>
                <Text style={[styles.timelineLabel, step.done && styles.timelineLabelDone]}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Worker Card */}
        {job.worker && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Assigned Worker</Text>
            <View style={styles.workerCard}>
              <View style={styles.workerAvatar}>
                <Text style={styles.workerAvatarText}>{getInitials(job.worker.name)}</Text>
              </View>
              <View style={styles.workerInfo}>
                <View style={styles.workerNameRow}>
                  <Text style={styles.workerName}>{job.worker.name}</Text>
                  {job.worker.verified && (
                    <Text style={styles.verifiedIcon}>✓</Text>
                  )}
                </View>
                <Text style={styles.workerCategory}>{job.worker.category}</Text>
                <StarRating rating={job.worker.rating} size={12} showValue />
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCallWorker}>
              <Text style={styles.callBtnText}>📞 Call Worker</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {job.status === 'completed' && (
            <TouchableOpacity style={styles.rateBtn} onPress={handleRateWorker} activeOpacity={0.8}>
              <Text style={styles.rateBtnText}>⭐ Rate Worker</Text>
            </TouchableOpacity>
          )}
          {isPending && (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel Job</Text>
            </TouchableOpacity>
          )}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  statusRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.sm },
  statusBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 8 },
  statusText: { fontSize: FONT_SIZES.sm, fontWeight: '700' },
  urgentBadge: { backgroundColor: COLORS.dangerLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 8 },
  urgentText: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.danger },
  card: { backgroundColor: COLORS.surface, margin: SPACING.lg, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderLight },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  categoryIcon: { fontSize: 36, marginRight: SPACING.md },
  titleInfo: { flex: 1 },
  title: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 2 },
  rateBox: { backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg },
  rateValue: { fontSize: FONT_SIZES.xxxl, fontWeight: '900', color: COLORS.primaryDark },
  rateLabel: { fontSize: FONT_SIZES.md, color: COLORS.primaryDark, opacity: 0.7 },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  description: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 22 },
  locationText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  addressText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  postedRow: { paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  postedLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  timeline: { marginTop: SPACING.md },
  timelineStep: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  timelineDotRow: { flexDirection: 'row', alignItems: 'center' },
  timelineDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.border, borderWidth: 2, borderColor: COLORS.border },
  timelineDotDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timelineLine: { width: 40, height: 2, backgroundColor: COLORS.border, marginLeft: SPACING.xs },
  timelineLineDone: { backgroundColor: COLORS.primary },
  timelineLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight, marginLeft: SPACING.sm },
  timelineLabelDone: { color: COLORS.primaryDark },
  workerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.borderLight, borderRadius: 12, padding: SPACING.md },
  workerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  workerAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  workerInfo: { flex: 1 },
  workerNameRow: { flexDirection: 'row', alignItems: 'center' },
  workerName: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  verifiedIcon: { color: COLORS.primary, fontSize: 14, fontWeight: '700', marginLeft: SPACING.xs },
  workerCategory: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  callBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  callBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.md, fontWeight: '700' },
  actions: { marginHorizontal: SPACING.lg, gap: SPACING.md },
  rateBtn: { backgroundColor: '#FEF3C7', borderRadius: 16, paddingVertical: SPACING.lg, alignItems: 'center' },
  rateBtnText: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: '#92400E' },
  cancelBtn: { backgroundColor: COLORS.dangerLight, borderRadius: 16, paddingVertical: SPACING.lg, alignItems: 'center' },
  cancelBtnText: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.danger },
})
