import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'

interface StatsRowProps {
  stats: Array<{
    label: string
    value: string | number
    icon: string
    color?: string
    bgColor?: string
  }>
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View
          key={stat.label}
          style={[
            styles.statCard,
            { backgroundColor: stat.bgColor || COLORS.primaryLight },
          ]}
        >
          <Text style={styles.statIcon}>{stat.icon}</Text>
          <Text
            style={[styles.statValue, { color: stat.color || COLORS.primaryDark }]}
          >
            {stat.value}
          </Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
})
