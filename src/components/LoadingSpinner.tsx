import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../utils/constants'

interface LoadingSpinnerProps {
  size?: number
  color?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 40,
  color = COLORS.primary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
})
