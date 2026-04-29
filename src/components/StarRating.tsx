import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '../utils/constants'

interface StarRatingProps {
  rating: number
  size?: number
  showValue?: boolean
  reviewCount?: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

export default function StarRating({
  rating,
  size = 16,
  showValue = false,
  reviewCount,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Text
          key={`star-${i}`}
          style={[styles.star, { fontSize: size }]}
          onPress={() => interactive && onRate?.(i)}
        >
          ★
        </Text>
      )
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <Text
          key={`star-${i}`}
          style={[styles.star, { fontSize: size }]}
          onPress={() => interactive && onRate?.(i)}
        >
          ★
        </Text>
      )
    } else {
      stars.push(
        <Text
          key={`star-${i}`}
          style={[styles.emptyStar, { fontSize: size }]}
          onPress={() => interactive && onRate?.(i)}
        >
          ★
        </Text>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.stars}>{stars}</View>
      {showValue && (
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      )}
      {reviewCount !== undefined && (
        <Text style={styles.reviewCount}>({reviewCount})</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    color: '#F59E0B',
  },
  star: {
    color: '#F59E0B',
  },
  emptyStar: {
    color: COLORS.border,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
})
