import React, { useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import LoadingSpinner from '../../components/LoadingSpinner'
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants'
import { formatDate } from '../../utils/formatPKR'

interface NotificationsScreenProps {
  navigation: any
}

export default function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const { employer, demoMode } = useAuth()
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  } = useNotifications()

  const demoNotifications = [
    { id: 'n1', title: 'Worker Accepted Your Job', message: 'Hassan Mehmood has accepted your painting job. Contact them to coordinate.', type: 'job', read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'n2', title: 'Job Completed', message: 'The AC repair job has been marked as completed by Rizwan Khan. Please rate the worker.', type: 'job', read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'n3', title: 'New Worker Available', message: 'A top-rated electrician is now available in your area!', type: 'system', read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'n4', title: 'Payment Confirmed', message: 'Payment of Rs. 3,500 for painting job has been confirmed.', type: 'payment', read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 'n5', title: 'Profile Verified', message: 'Congratulations! Your employer profile has been verified.', type: 'system', read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 'n6', title: 'Special Offer', message: 'Post 3 jobs this week and get a 10% commission discount!', type: 'promo', read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
  ]

  useEffect(() => {
    if (!demoMode && employer?.id) {
      fetchNotifications(employer.id)
    }
  }, [employer?.id])

  const onRefresh = useCallback(async () => {
    if (!demoMode && employer?.id) {
      await fetchNotifications(employer.id)
    }
  }, [employer?.id])

  const handleNotifPress = (notifId: string, isRead: boolean) => {
    if (!isRead && !demoMode) {
      markAsRead(notifId)
    }
  }

  const handleDelete = (notifId: string) => {
    Alert.alert('Delete', 'Delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNotification(notifId) },
    ])
  }

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'job': return '📋'
      case 'payment': return '💰'
      case 'review': return '⭐'
      case 'system': return '🔔'
      case 'promo': return '🎉'
      default: return '💬'
    }
  }

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'job': return COLORS.primary
      case 'payment': return '#10B981'
      case 'review': return '#F59E0B'
      case 'promo': return '#8B5CF6'
      default: return '#6B7280'
    }
  }

  const displayNotifs = demoMode ? demoNotifications : notifications
  const currentUnreadCount = demoMode
    ? demoNotifications.filter((n) => !n.read).length
    : unreadCount

  const renderNotif = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.read && styles.notifUnread]}
      onPress={() => handleNotifPress(item.id, item.read)}
      onLongPress={() => handleDelete(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.notifIconBox, { backgroundColor: getNotifColor(item.type) + '15' }]}>
        <Text style={styles.notifIcon}>{getNotifIcon(item.type)}</Text>
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.notifTime}>{formatDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {currentUnreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{currentUnreadCount} new</Text>
          </View>
        )}
      </View>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : displayNotifs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            You're all caught up! We'll notify you about job updates.
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayNotifs}
          keyExtractor={(item) => item.id}
          renderItem={renderNotif}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  unreadBadge: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 8 },
  unreadBadgeText: { color: '#FFFFFF', fontSize: FONT_SIZES.sm, fontWeight: '700' },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 20 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  notifCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 14, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderLight },
  notifUnread: { backgroundColor: COLORS.primary + '08', borderColor: COLORS.primary + '30' },
  notifIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  notifIcon: { fontSize: 22 },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: SPACING.sm },
  notifMessage: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20, marginTop: 2 },
  notifTime: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
})
