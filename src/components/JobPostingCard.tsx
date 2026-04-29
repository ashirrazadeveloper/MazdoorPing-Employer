import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Job } from '../types'
import { CATEGORIES, COLORS, SPACING, JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '../utils/constants'
import { formatPKR, formatDate } from '../utils/formatPKR'

interface JobPostingCardProps {
  job: Job
  onPress?: (job: Job) => void
  showStatus?: boolean
}

export default function JobPostingCard({
  job,
  onPress,
  showStatus = true,
}: JobPostingCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.name === job.category)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(job)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryIcon}>
          <Text style={styles.categoryIconText}>{categoryInfo?.icon || '📋'}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.category}>
            {job.category} • {job.city}
            {job.area ? `, ${job.area}` : ''}
          </Text>
        </View>
        {showStatus && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: JOB_STATUS_COLORS[job.status] + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: JOB_STATUS_COLORS[job.status] },
              ]}
            >
              {JOB_STATUS_LABELS[job.status]}
            </Text>
          </View>
        )}
      </View>

      {job.description && (
        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>
      )}

      {job.worker && (
        <View style={styles.workerRow}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerAvatarText}>
              {job.worker.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.workerName}>
            {job.worker.name}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.rateContainer}>
          <Text style={styles.rate}>{formatPKR(job.rate)}</Text>
          <Text style={styles.rateType}>/{job.rate_type}</Text>
        </View>
        <View style={styles.footerRight}>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
          <Text style={styles.time}>{formatDate(job.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  categoryIconText: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: SPACING.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.sm,
    borderRadius: 10,
  },
  workerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  workerAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  workerName: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rate: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  rateType: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  urgentBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgentText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
  },
})
