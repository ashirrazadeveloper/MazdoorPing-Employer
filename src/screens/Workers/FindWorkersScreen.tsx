import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useWorkers } from '../../hooks/useWorkers'
import WorkerCard from '../../components/WorkerCard'
import CategoryChip from '../../components/CategoryChip'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  COLORS, SPACING, FONT_SIZES, CATEGORIES, CITIES,
} from '../../utils/constants'
import { Worker } from '../../types'

interface FindWorkersScreenProps {
  navigation: any
  route?: any
}

export default function FindWorkersScreen({ navigation, route }: FindWorkersScreenProps) {
  const { demoMode } = useAuth()
  const { workers, loading, fetchAvailableWorkers } = useWorkers()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || 'All')
  const [selectedCity, setSelectedCity] = useState('All')
  const [searchText, setSearchText] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Demo workers
  const demoWorkers: Worker[] = [
    { id: 'dw1', name: 'Muhammad Ali', phone: '+923001234567', category: 'Electrician', experience: 8, rate: 2500, rate_type: 'daily', rating: 4.7, total_jobs: 156, available: true, city: 'Lahore', area: 'Johar Town', language: 'en', verified: true, premium: false, balance: 12500, total_earned: 385000, created_at: new Date().toISOString(), bio: 'Expert in residential and commercial wiring.' },
    { id: 'dw2', name: 'Hassan Mehmood', phone: '+923002345678', category: 'Painter', experience: 5, rate: 1800, rate_type: 'daily', rating: 4.5, total_jobs: 89, available: true, city: 'Lahore', area: 'Gulberg', language: 'en', verified: true, premium: false, balance: 8500, total_earned: 160000, created_at: new Date().toISOString(), bio: 'Interior and exterior painting specialist.' },
    { id: 'dw3', name: 'Babar Hussain', phone: '+923003456789', category: 'Plumber', experience: 12, rate: 2000, rate_type: 'daily', rating: 4.8, total_jobs: 210, available: true, city: 'Lahore', area: 'DHA Phase 5', language: 'en', verified: true, premium: true, balance: 25000, total_earned: 500000, created_at: new Date().toISOString() },
    { id: 'dw4', name: 'Usman Ahmad', phone: '+923004567890', category: 'Carpenter', experience: 7, rate: 2200, rate_type: 'daily', rating: 4.3, total_jobs: 67, available: true, city: 'Islamabad', area: 'G-10', language: 'en', verified: true, premium: false, balance: 6000, total_earned: 147000, created_at: new Date().toISOString() },
    { id: 'dw5', name: 'Rizwan Khan', phone: '+923005678901', category: 'AC Technician', experience: 6, rate: 2500, rate_type: 'job', rating: 4.6, total_jobs: 124, available: true, city: 'Karachi', area: 'Clifton', language: 'en', verified: true, premium: false, balance: 15000, total_earned: 310000, created_at: new Date().toISOString() },
    { id: 'dw6', name: 'Faisal Iqbal', phone: '+923006789012', category: 'Mason', experience: 10, rate: 2000, rate_type: 'daily', rating: 4.4, total_jobs: 178, available: true, city: 'Rawalpindi', area: 'Saddar', language: 'en', verified: false, premium: false, balance: 9500, total_earned: 356000, created_at: new Date().toISOString() },
    { id: 'dw7', name: 'Imran Javed', phone: '+923007890123', category: 'Welder', experience: 9, rate: 2800, rate_type: 'daily', rating: 4.9, total_jobs: 201, available: true, city: 'Faisalabad', area: 'Madina Town', language: 'en', verified: true, premium: true, balance: 30000, total_earned: 564000, created_at: new Date().toISOString() },
    { id: 'dw8', name: 'Naveed Aslam', phone: '+923008901234', category: 'Tile Fixer', experience: 6, rate: 2200, rate_type: 'daily', rating: 4.2, total_jobs: 55, available: true, city: 'Lahore', area: 'Model Town', language: 'en', verified: false, premium: false, balance: 4500, total_earned: 121000, created_at: new Date().toISOString() },
  ]

  useEffect(() => {
    if (!demoMode) {
      fetchAvailableWorkers(selectedCategory, selectedCity, searchText)
    }
  }, [selectedCategory, selectedCity])

  useEffect(() => {
    if (route?.params?.category) {
      setSelectedCategory(route.params.category)
    }
  }, [route?.params?.category])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (!demoMode) {
      await fetchAvailableWorkers(selectedCategory, selectedCity, searchText)
    }
    setRefreshing(false)
  }, [selectedCategory, selectedCity, searchText])

  const handleSearch = () => {
    if (!demoMode) {
      fetchAvailableWorkers(selectedCategory, selectedCity, searchText)
    }
  }

  const displayWorkers = demoMode ? demoWorkers : workers
  const filteredWorkers = displayWorkers.filter((w) => {
    if (selectedCategory !== 'All' && w.category !== selectedCategory) return false
    if (selectedCity !== 'All' && w.city !== selectedCity) return false
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      return (
        w.name.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleBookNow = (worker: Worker) => {
    navigation.navigate('PostJob', { prefillCategory: worker.category, workerId: worker.id })
  }

  const handleWorkerPress = (worker: Worker) => {
    navigation.navigate('WorkerDetail', { workerId: worker.id })
  }

  const activeFilters = (selectedCategory !== 'All' ? 1 : 0) + (selectedCity !== 'All' ? 1 : 0)

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Workers</Text>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilters > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={[styles.filterBtnText, activeFilters > 0 && styles.filterBtnTextActive]}>
            Filters {activeFilters > 0 ? `(${activeFilters})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, category, city..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        <CategoryChip
          label="All"
          selected={selectedCategory === 'All'}
          onPress={() => setSelectedCategory('All')}
        />
        {CATEGORIES.slice(0, 8).map((cat) => (
          <CategoryChip
            key={cat.name}
            label={cat.name}
            icon={cat.icon}
            selected={selectedCategory === cat.name}
            onPress={() => setSelectedCategory(cat.name)}
          />
        ))}
      </ScrollView>

      {loading && !refreshing ? (
        <LoadingSpinner fullScreen />
      ) : filteredWorkers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👷</Text>
          <Text style={styles.emptyTitle}>No Workers Found</Text>
          <Text style={styles.emptyText}>
            {activeFilters > 0
              ? 'Try changing your filters'
              : 'No workers available right now'}
          </Text>
          {activeFilters > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('All')
                setSelectedCity('All')
                setSearchText('')
              }}
              style={styles.clearBtn}
            >
              <Text style={styles.clearBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item}
              onPress={handleWorkerPress}
              onBookNow={handleBookNow}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Workers</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>City</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              <CategoryChip label="All" selected={selectedCity === 'All'} onPress={() => setSelectedCity('All')} />
              {CITIES.map((city) => (
                <CategoryChip key={city} label={`📍 ${city}`} selected={selectedCity === city} onPress={() => setSelectedCity(city)} />
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  filterBtn: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterBtnText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textSecondary },
  filterBtnTextActive: { color: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: { fontSize: 20 },
  chipsScroll: { marginBottom: SPACING.sm },
  chipsContent: { paddingHorizontal: SPACING.lg },
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
  clearBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  clearBtnText: { color: COLORS.primaryDark, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xxl,
    maxHeight: '50%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text },
  modalClose: { fontSize: 24, color: COLORS.textSecondary },
  filterLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  applyBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
})
