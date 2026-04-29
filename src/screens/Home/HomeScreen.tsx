import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import { useJobs } from '../../hooks/useJobs'
import StatsRow from '../../components/StatsRow'
import LoadingSpinner from '../../components/LoadingSpinner'
import { COLORS, SPACING, FONT_SIZES, CATEGORIES } from '../../utils/constants'
import { formatPKR } from '../../utils/formatPKR'
import { Employer, Job } from '../../types'

const { width } = Dimensions.get('window')

interface HomeScreenProps {
  navigation: any
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { employer, demoMode } = useAuth()
  const { unreadCount, fetchNotifications } = useNotifications()
  const { myJobs, fetchMyJobs } = useJobs()
  const [refreshing, setRefreshing] = useState(false)

  // Demo employer data
  const demoEmployer: Employer = {
    id: 'demo-employer-001',
    name: 'Ahmed Khan',
    phone: '+923001111111',
    type: 'individual',
    city: 'Lahore',
    area: 'DHA Phase 6',
    verified: true,
    created_at: new Date().toISOString(),
  }

  const demoJobs: Job[] = [
    { id: 'dj1', title: 'Paint Living Room', category: 'Painter', rate: 3500, rate_type: 'daily', status: 'completed', city: 'Lahore', urgent: false, payment_method: 'cash', payment_status: 'paid', employer_id: 'demo-employer-001', created_at: new Date(Date.now() - 86400000).toISOString(), completed_at: new Date(Date.now() - 43200000).toISOString() },
    { id: 'dj2', title: 'AC Repair', category: 'AC Technician', rate: 2000, rate_type: 'job', status: 'in_progress', city: 'Lahore', urgent: false, payment_method: 'cash', payment_status: 'pending', employer_id: 'demo-employer-001', worker_id: 'dw1', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'dj3', title: 'Bathroom Plumbing', category: 'Plumber', rate: 1500, rate_type: 'job', status: 'pending', city: 'Lahore', urgent: true, payment_method: 'jazzcash', payment_status: 'pending', employer_id: 'demo-employer-001', created_at: new Date(Date.now() - 1800000).toISOString() },
  ]

  const currentEmployer = demoMode ? demoEmployer : employer
  const currentJobs = demoMode ? demoJobs : myJobs

  useEffect(() => {
    if (currentEmployer?.id && !demoMode) {
      fetchNotifications(currentEmployer.id)
      fetchMyJobs(currentEmployer.id)
    }
  }, [currentEmployer?.id])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (currentEmployer?.id && !demoMode) {
      await Promise.all([
        fetchNotifications(currentEmployer.id),
        fetchMyJobs(currentEmployer.id),
      ])
    }
    setRefreshing(false)
  }, [currentEmployer?.id])

  const activeJobs = currentJobs.filter(
    (j) => j.status === 'pending' || j.status === 'accepted' || j.status === 'in_progress'
  )
  const completedJobs = currentJobs.filter((j) => j.status === 'completed')

  const quickActions = [
    { icon: '🔍', label: 'Find Workers', color: COLORS.primaryLight, onPress: () => navigation.navigate('FindWorkers') },
    { icon: '📋', label: 'Post a Job', color: '#FEF3C7', onPress: () => navigation.navigate('PostJob') },
    { icon: '📁', label: 'My Bookings', color: '#D1FAE5', onPress: () => navigation.navigate('MyBookings') },
    { icon: '📂', label: 'Categories', color: '#FEE2E2', onPress: () => navigation.navigate('Categories') },
    { icon: '❤️', label: 'Favorites', color: '#FCE7F3', onPress: () => navigation.navigate('Favorites') },
    { icon: '⭐', label: 'Rate Worker', color: '#FDE68A', onPress: () => navigation.navigate('RateWorker', { jobId: 'dj1', workerId: 'dw1' }) },
  ]

  if (!currentEmployer && !demoMode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👷</Text>
          <Text style={styles.emptyTitle}>Welcome to MazdoorPing</Text>
          <Text style={styles.emptyText}>Please login or register to continue</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'} 👋
            </Text>
            <Text style={styles.userName}>{currentEmployer?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notifIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Banner */}
        {demoMode && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>
              🎮 Demo Mode — Data shown is for preview purposes
            </Text>
          </View>
        )}

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Find the Best Workers</Text>
          <Text style={styles.welcomeSubtitle}>
            Browse {CATEGORIES.length} categories across 8 cities in Pakistan
          </Text>
          <TouchableOpacity
            style={styles.welcomeBtn}
            onPress={() => navigation.navigate('FindWorkers')}
            activeOpacity={0.8}
          >
            <Text style={styles.welcomeBtnText}>🔍 Search Workers</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
        </View>
        <StatsRow
          stats={[
            { label: 'Active', value: activeJobs.length, icon: '📋', color: '#2563EB', bgColor: COLORS.primaryLight },
            { label: 'Completed', value: completedJobs.length, icon: '✅', color: '#059669', bgColor: '#D1FAE5' },
          ]}
        />
        <StatsRow
          stats={[
            { label: 'Categories', value: CATEGORIES.length, icon: '📂', color: '#D97706', bgColor: '#FEF3C7' },
            { label: 'Favorites', value: '5', icon: '❤️', color: '#DB2777', bgColor: '#FCE7F3' },
          ]}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.actionCard, { backgroundColor: action.color }]}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
        </View>
        <View style={styles.categoriesScroll}>
          {CATEGORIES.slice(0, 7).map((cat) => (
            <TouchableOpacity
              key={cat.name}
              style={styles.categoryPill}
              onPress={() =>
                navigation.navigate('FindWorkers', { category: cat.name })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.categoryPillIcon}>{cat.icon}</Text>
              <Text style={styles.categoryPillText} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.categoryPill, styles.seeAllPill]}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.categoryPillIcon}>➕</Text>
            <Text style={styles.categoryPillText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Jobs */}
        {currentJobs.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Jobs</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
                <Text style={styles.seeAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {currentJobs.slice(0, 3).map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobCardHeader}>
                  <Text style={styles.jobCardTitle} numberOfLines={1}>{job.title}</Text>
                  <View
                    style={[
                      styles.jobStatusBadge,
                      { backgroundColor: COLORS.primaryLight },
                    ]}
                  >
                    <Text style={[styles.jobStatusText, { color: COLORS.primaryDark }]}>
                      {job.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.jobCardCategory}>{job.category} • {job.city}</Text>
                <Text style={styles.jobCardRate}>{formatPKR(job.rate)}/{job.rate_type}</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xxl },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.lg },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  userName: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  notifBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifIcon: { fontSize: 20 },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  notifBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  demoBanner: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: SPACING.lg,
    padding: SPACING.sm + SPACING.xs,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  demoBannerText: { fontSize: 12, color: '#92400E', fontWeight: '600' },
  welcomeCard: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    borderRadius: 20,
    padding: SPACING.xl,
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  welcomeSubtitle: { fontSize: FONT_SIZES.md, color: '#DBEAFE', marginBottom: SPACING.lg },
  welcomeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignSelf: 'flex-start',
  },
  welcomeBtnText: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.primaryDark },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  seeAllText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  actionCard: {
    width: (width - SPACING.xxl * 2 - SPACING.md * 2) / 3,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: { fontSize: 28, marginBottom: SPACING.xs },
  actionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  categoriesScroll: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    overflow: 'hidden',
  },
  categoryPill: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.sm,
    minWidth: 72,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  seeAllPill: { borderColor: COLORS.primary, borderWidth: 1.5 },
  categoryPillIcon: { fontSize: 22, marginBottom: 2 },
  categoryPillText: { fontSize: 11, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  jobCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  jobCardTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, flex: 1 },
  jobStatusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  jobStatusText: { fontSize: 11, fontWeight: '600' },
  jobCardCategory: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  jobCardRate: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.primaryDark, marginTop: 2 },
})
