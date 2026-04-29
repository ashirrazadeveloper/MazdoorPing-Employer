import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
  Linking,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import StarRating from '../../components/StarRating'
import LoadingSpinner from '../../components/LoadingSpinner'
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants'
import { getInitials } from '../../utils/formatPKR'
import { Employer } from '../../types'
import { supabase } from '../../lib/supabase'

interface ProfileScreenProps {
  navigation: any
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { employer, demoMode, signOut, setEmployer } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState(employer?.name || '')
  const [editArea, setEditArea] = useState(employer?.area || '')

  // Demo employer
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

  const currentEmployer = demoMode ? demoEmployer : employer

  useEffect(() => {
    if (currentEmployer) {
      setEditName(currentEmployer.name)
      setEditArea(currentEmployer.area || '')
    }
  }, [currentEmployer?.id])

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty')
      return
    }
    if (demoMode) {
      setEditMode(false)
      Alert.alert('Demo Mode', 'Profile updated! (Demo)')
      return
    }
    try {
      const { data, error } = await supabase
        .from('employers')
        .update({ name: editName.trim(), area: editArea.trim() || undefined })
        .eq('id', currentEmployer?.id)
        .select()
        .single()
      if (error) throw error
      if (data) setEmployer(data as Employer)
      setEditMode(false)
      Alert.alert('Success', 'Profile updated!')
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile')
    }
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try { await signOut() } catch (err) { console.error('Logout error:', err) }
        },
      },
    ])
  }

  const handleContactSupport = () => {
    Linking.openURL('https://wa.me/923001111111')
  }

  if (!currentEmployer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyTitle}>Not Logged In</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const menuItems = [
    { icon: '📋', label: 'My Bookings', onPress: () => navigation.navigate('MyBookings') },
    { icon: '⭐', label: 'Rate Workers', onPress: () => navigation.navigate('RateWorker', { jobId: 'dj1', workerId: 'dw1' }) },
    { icon: '❤️', label: 'Favorites', onPress: () => navigation.navigate('Favorites') },
    { icon: '📂', label: 'Categories', onPress: () => navigation.navigate('Categories') },
    { icon: '🔔', label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
    { icon: '💬', label: 'Contact Support', onPress: handleContactSupport },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{getInitials(currentEmployer.name)}</Text>
            </View>
            {currentEmployer.verified && (
              <View style={styles.verifiedOverlay}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{currentEmployer.name}</Text>
          <Text style={styles.phone}>{currentEmployer.phone}</Text>
          <View style={styles.badgesRow}>
            {currentEmployer.verified && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ Verified Employer</Text>
              </View>
            )}
            <View style={[styles.badge, styles.typeBadge]}>
              <Text style={styles.typeBadgeText}>
                {currentEmployer.type === 'individual' ? '👤' : currentEmployer.type === 'contractor' ? '🏗️' : '🏢'}{' '}
                {currentEmployer.type.charAt(0).toUpperCase() + currentEmployer.type.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Profile Information</Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Text style={styles.editText}>{editMode ? 'Cancel' : '✏️ Edit'}</Text>
            </TouchableOpacity>
          </View>

          {editMode ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your name"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Area</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editArea}
                  onChangeText={setEditArea}
                  placeholder="Your area"
                />
              </View>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoDetails}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{currentEmployer.phone}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>
                  {currentEmployer.type.charAt(0).toUpperCase() + currentEmployer.type.slice(1)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>📍 {currentEmployer.city}</Text>
              </View>
              {currentEmployer.area && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Area</Text>
                    <Text style={styles.infoValue}>{currentEmployer.area}</Text>
                  </View>
                </>
              )}
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentEmployer.created_at).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive job updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {demoMode && (
            <TouchableOpacity style={styles.demoExitBtn} onPress={() => Alert.alert('Demo', 'Refresh the app to exit demo mode.')}>
              <Text style={styles.demoExitBtnText}>🎮 Exit Demo Mode</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>MazdoorPing Employer v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xxl },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.lg },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  profileHeader: { alignItems: 'center', paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.lg },
  avatarContainer: { position: 'relative', marginBottom: SPACING.lg },
  avatarFallback: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.primaryDark },
  avatarFallbackText: { color: '#FFFFFF', fontSize: 36, fontWeight: '700' },
  verifiedOverlay: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.surface },
  verifiedIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: COLORS.text },
  phone: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 4 },
  badgesRow: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm },
  badge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 8 },
  badgeText: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.primaryDark },
  typeBadge: { backgroundColor: '#FEF3C7' },
  typeBadgeText: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: '#92400E' },
  infoCard: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  infoTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  editText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
  fieldGroup: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  fieldInput: { backgroundColor: COLORS.borderLight, borderRadius: 10, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONT_SIZES.md, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  saveBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.md, fontWeight: '700' },
  infoDetails: {},
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  infoLabel: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.borderLight },
  settingCard: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  settingSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  menuCard: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: 16, overflow: 'hidden', marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.surface },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuIcon: { fontSize: 20, marginRight: SPACING.md },
  menuLabel: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  menuArrow: { fontSize: FONT_SIZES.md, color: COLORS.textLight },
  actions: { marginHorizontal: SPACING.lg, marginTop: SPACING.lg },
  demoExitBtn: { backgroundColor: '#FEF3C7', borderRadius: 14, paddingVertical: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
  demoExitBtnText: { fontSize: FONT_SIZES.md, fontWeight: '700', color: '#92400E' },
  logoutBtn: { backgroundColor: COLORS.dangerLight, borderRadius: 14, paddingVertical: SPACING.lg, alignItems: 'center' },
  logoutBtnText: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.danger },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textLight, marginTop: SPACING.xl },
})
