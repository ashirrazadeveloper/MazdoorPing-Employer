import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useJobs } from '../../hooks/useJobs'
import JobPostingCard from '../../components/JobPostingCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { COLORS, SPACING, FONT_SIZES, JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '../../utils/constants'
import { Job } from '../../types'

interface MyBookingsScreenProps {
  navigation: any
}

export default function MyBookingsScreen({ navigation }: MyBookingsScreenProps) {
  const { employer, demoMode } = useAuth()
  const { myJobs, loading, fetchMyJobs } = useJobs()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all')
  const [refreshing, setRefreshing] = useState(false)

  // Demo jobs
  const demoJobs: Job[] = [
    { id: 'dj1', title: 'Paint Living Room', category: 'Painter', description: 'Need to paint living room with emulsion paint.', rate: 3500, rate_type: 'daily', status: 'completed', city: 'Lahore', area: 'DHA Phase 6', address: 'House 42, Street 5', urgent: false, payment_method: 'cash', payment_status: 'paid', employer_id: 'de1', worker_id: 'dw2', worker: { id: 'dw2', name: 'Hassan Mehmood', category: 'Painter', rate: 1800, rate_type: 'daily', rating: 4.5, total_jobs: 89, available: true, city: 'Lahore', area: 'Gulberg', experience: 5, verified: true, premium: false, balance: 0, total_earned: 0, language: 'en', created_at: '' }, created_at: new Date(Date.now() - 86400000).toISOString(), completed_at: new Date(Date.now() - 43200000).toISOString() },
    { id: 'dj2', title: 'AC Repair Service', category: 'AC Technician', description: 'Split AC not cooling properly. Need gas refill and service.', rate: 2000, rate_type: 'job', status: 'in_progress', city: 'Lahore', area: 'Gulberg', urgent: false, payment_method: 'cash', payment_status: 'pending', employer_id: 'de1', worker_id: 'dw5', worker: { id: 'dw5', name: 'Rizwan Khan', category: 'AC Technician', rate: 2500, rate_type: 'job', rating: 4.6, total_jobs: 124, available: true, city: 'Karachi', area: 'Clifton', experience: 6, verified: true, premium: false, balance: 0, total_earned: 0, language: 'en', created_at: '' }, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'dj3', title: 'Bathroom Plumbing', category: 'Plumber', description: 'Fix leaking tap and unclog drain.', rate: 1500, rate_type: 'job', status: 'pending', city: 'Lahore', urgent: true, payment_method: 'jazzcash', payment_status: 'pending', employer_id: 'de1', created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'dj4', title: 'Kitchen Cabinet', category: 'Carpenter', description: 'Build L-shaped kitchen cabinet.', rate: 15000, rate_type: 'job', status: 'accepted', city: 'Lahore', area: 'Model Town', urgent: false, payment_method: 'easypaisa', payment_status: 'pending', employer_id: 'de1', worker_id: 'dw4', worker: { id: 'dw4', name: 'Usman Ahmad', category: 'Carpenter', rate: 2200, rate_type: 'daily', rating: 4.3, total_jobs: 67, available: true, city: 'Islamabad', area: 'G-10', experience: 7, verified: true, premium: false, balance: 0, total_earned: 0, language: 'en', created_at: '' }, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'dj5', title: 'House Wiring', category: 'Electrician', description: 'Complete wiring for 5 marla house.', rate: 25000, rate_type: 'job', status: 'completed', city: 'Lahore', area: 'Johar Town', urgent: false, payment_method: 'bank_transfer', payment_status: 'paid', employer_id: 'de1', worker_id: 'dw1', created_at: new Date(Date.now() - 604800000).toISOString(), completed_at: new Date(Date.now() - 518400000).toISOString() },
  ]

  const currentJobs = demoMode ? demoJobs : myJobs

  useEffect(() => {
    if (!demoMode && employer?.id) {
      fetchMyJobs(employer.id)
    }
  }, [employer?.id])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (!demoMode && employer?.id) {
      await fetchMyJobs(employer.id)
    }
    setRefreshing(false)
  }, [employer?.id])

  const filteredJobs = currentJobs.filter((job) => {
    if (activeTab === 'active') {
      return ['pending', 'accepted', 'in_progress'].includes(job.status)
    }
    if (activeTab === 'completed') {
      return job.status === 'completed'
    }
    return true
  })

  const tabs = [
    { key: 'all' as const, label: 'All', count: currentJobs.length },
    { key: 'active' as const, label: 'Active', count: currentJobs.filter((j) => ['pending', 'accepted', 'in_progress'].includes(j.status)).length },
    { key: 'completed' as const, label: 'Completed', count: currentJobs.filter((j) => j.status === 'completed').length },
  ]

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetail', { jobId: job.id })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <LoadingSpinner fullScreen />
      ) : filteredJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Jobs Found</Text>
          <Text style={styles.emptyText}>
            {activeTab === 'completed'
              ? 'Completed jobs will appear here'
              : activeTab === 'active'
              ? 'No active jobs'
              : 'Post your first job to get started'}
          </Text>
          {activeTab === 'all' && (
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() => navigation.navigate('PostJob')}
            >
              <Text style={styles.postBtnText}>Post a Job</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobPostingCard job={item} onPress={handleJobPress} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  tabBar: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.sm },
  tab: {
    flex: 1, paddingVertical: SPACING.sm, borderRadius: 10,
    backgroundColor: COLORS.surface, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFFFFF' },
  list: { paddingBottom: 20 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  postBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  postBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.md, fontWeight: '700' },
})
