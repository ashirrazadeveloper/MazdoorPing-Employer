import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Worker } from '../types'
import { CATEGORIES, COLORS, SPACING, FONT_SIZES } from '../utils/constants'
import { formatPKR, getInitials } from '../utils/formatPKR'
import StarRating from './StarRating'

interface WorkerCardProps {
  worker: Worker
  onPress?: (worker: Worker) => void
  onBookNow?: (worker: Worker) => void
  onFavorite?: (worker: Worker) => void
  isFavorite?: boolean
}

export default function WorkerCard({
  worker,
  onPress,
  onBookNow,
  onFavorite,
  isFavorite = false,
}: WorkerCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.name === worker.category)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(worker)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {worker.photo ? null : getInitials(worker.name)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {worker.name}
            </Text>
            {worker.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
            {onFavorite && (
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => onFavorite(worker)}
              >
                <Text style={styles.favoriteIcon}>
                  {isFavorite ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tagRow}>
            <Text style={styles.categoryTag}>
              {categoryInfo?.icon || '🔨'} {worker.category}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rating</Text>
          <StarRating rating={worker.rating} size={12} showValue />
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rate</Text>
          <Text style={styles.detailValue}>
            {formatPKR(worker.rate)}/{worker.rate_type}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Jobs</Text>
          <Text style={styles.detailValue}>{worker.total_jobs}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>
            {worker.city}{worker.area ? `, ${worker.area}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => onBookNow?.(worker)}
          activeOpacity={0.8}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
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
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  favoriteBtn: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  categoryTag: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.borderLight,
    borderRadius: 12,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
})
