import React, { useState, useEffect, useCallback } from 'react'
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
import { useWorkers } from '../../hooks/useWorkers'
import WorkerCard from '../../components/WorkerCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { COLORS, SPACING, FONT_SIZES, CATEGORIES } from '../../utils/constants'
import { Worker } from '../../types'
import { supabase } from '../../lib/supabase'

interface FavoritesScreenProps {
  navigation: any
}

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { employer, demoMode } = useAuth()
  const { workers: favWorkers, loading, fetchFavorites, toggleFavorite } = useWorkers()
  const [refreshing, setRefreshing] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  // Demo favorites
  const demoFavWorkers: Worker[] = [
    { id: 'dw1', name: 'Muhammad Ali', phone: '+923001234567', category: 'Electrician', experience: 8, rate: 2500, rate_type: 'daily', rating: 4.7, total_jobs: 156, available: true, city: 'Lahore', area: 'Johar Town', language: 'en', verified: true, premium: false, balance: 0, total_earned: 0, created_at: '' },
    { id: 'dw3', name: 'Babar Hussain', phone: '+923003456789', category: 'Plumber', experience: 12, rate: 2000, rate_type: 'daily', rating: 4.8, total_jobs: 210, available: true, city: 'Lahore', area: 'DHA Phase 5', language: 'en', verified: true, premium: true, balance: 0, total_earned: 0, created_at: '' },
    { id: 'dw5', name: 'Rizwan Khan', phone: '+923005678901', category: 'AC Technician', experience: 6, rate: 2500, rate_type: 'job', rating: 4.6, total_jobs: 124, available: true, city: 'Karachi', area: 'Clifton', language: 'en', verified: true, premium: false, balance: 0, total_earned: 0, created_at: '' },
    { id: 'dw7', name: 'Imran Javed', phone: '+923007890123', category: 'Welder', experience: 9, rate: 2800, rate_type: 'daily', rating: 4.9, total_jobs: 201, available: true, city: 'Faisalabad', area: 'Madina Town', language: 'en', verified: true, premium: true, balance: 0, total_earned: 0, created_at: '' },
  ]

  useEffect(() => {
    if (demoMode) {
      setFavoriteIds(new Set(demoFavWorkers.map((w) => w.id)))
    } else if (employer?.id) {
      loadFavorites()
    }
  }, [employer?.id])

  const loadFavorites = async () => {
    const favs = await fetchFavorites(employer!.id)
    const ids = new Set((favs as any[])?.map((f: any) => f.worker_id) || [])
    setFavoriteIds(ids)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (!demoMode && employer?.id) {
      await loadFavorites()
    }
    setRefreshing(false)
  }, [employer?.id])

  const displayWorkers = demoMode ? demoFavWorkers : favWorkers

  const handleRemoveFavorite = async (worker: Worker) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${worker.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (demoMode) {
              setFavoriteIds((prev) => {
                const next = new Set(prev)
                next.delete(worker.id)
                return next
              })
              return
            }
            if (employer?.id) {
              await toggleFavorite(worker.id, employer.id, true)
              setFavoriteIds((prev) => {
                const next = new Set(prev)
                next.delete(worker.id)
                return next
              })
            }
          },
        },
      ]
    )
  }

  const handleBookNow = (worker: Worker) => {
    navigation.navigate('PostJob', { prefillCategory: worker.category, workerId: worker.id })
  }

  const handleWorkerPress = (worker: Worker) => {
    navigation.navigate('WorkerDetail', { workerId: worker.id })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❤️ Favorites</Text>
        <Text style={styles.headerCount}>
          {displayWorkers.length} saved workers
        </Text>
      </View>

      {loading && !refreshing ? (
        <LoadingSpinner fullScreen />
      ) : displayWorkers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Save workers you like to quickly book them later
          </Text>
          <TouchableOpacity
            style={styles.findBtn}
            onPress={() => navigation.navigate('FindWorkers')}
          >
            <Text style={styles.findBtnText}>Find Workers</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayWorkers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item}
              onPress={handleWorkerPress}
              onBookNow={handleBookNow}
              onFavorite={handleRemoveFavorite}
              isFavorite={favoriteIds.has(item.id)}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  headerCount: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  list: { paddingBottom: 20 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  findBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  findBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.md, fontWeight: '700' },
})
