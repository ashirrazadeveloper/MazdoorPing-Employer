import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { CITIES, COLORS, SPACING, FONT_SIZES } from '../../utils/constants'
import { Employer } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    type: 'individual' as 'individual' | 'contractor' | 'company',
  })
  const [loading, setLoading] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return
    }
    if (!formData.phone || formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number')
      return
    }
    if (!formData.city) {
      Alert.alert('Error', 'Please select your city')
      return
    }

    setLoading(true)
    try {
      const employerId = `employer_${Date.now()}`

      const fullPhone = formData.phone.startsWith('+92')
        ? formData.phone
        : `+92${formData.phone}`

      const employerData: Partial<Employer> = {
        id: employerId,
        name: formData.name.trim(),
        phone: fullPhone,
        type: formData.type,
        city: formData.city,
        area: formData.area || undefined,
        verified: false,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('employers')
        .upsert(employerData)
        .select()
        .single()

      if (error) throw error

      const { setEmployer } = useAuth() as any
      Alert.alert('Success', 'Registration successful! Welcome to MazdoorPing Employer.')
    } catch (err: any) {
      Alert.alert('Registration Error', err.message || 'Failed to register')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Blue Gradient Header */}
          <View style={styles.gradientHeader}>
            <Text style={styles.headerTitle}>Register as Employer</Text>
            <Text style={styles.headerSubtitle}>
              Find skilled workers for your projects
            </Text>
          </View>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textLight}
              value={formData.name}
              onChangeText={(v) => updateField('name', v)}
            />
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>+92</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="3XX XXXXXXX"
                placeholderTextColor={COLORS.textLight}
                value={formData.phone}
                onChangeText={(v) => updateField('phone', v)}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>
          </View>

          {/* Employer Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Employer Type *</Text>
            <View style={styles.typeRow}>
              {(['individual', 'contractor', 'company'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    formData.type === type && styles.typeChipActive,
                  ]}
                  onPress={() => updateField('type', type)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      formData.type === type && styles.typeChipTextActive,
                    ]}
                  >
                    {type === 'individual'
                      ? '👤 Individual'
                      : type === 'contractor'
                      ? '🏗️ Contractor'
                      : '🏢 Company'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* City */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowCityModal(true)}
            >
              <Text
                style={[
                  styles.selectorText,
                  !formData.city && styles.selectorPlaceholder,
                ]}
              >
                {formData.city || 'Select city'}
              </Text>
              <Text style={styles.selectorArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Area */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Area / Locality</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., DHA Phase 5, Johar Town"
              placeholderTextColor={COLORS.textLight}
              value={formData.area}
              onChangeText={(v) => updateField('area', v)}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <LoadingSpinner size={24} color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Create Employer Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginRow}
          >
            <Text style={styles.loginText}>
              Already registered?{' '}
              <Text style={styles.linkText}>Login here</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* City Modal */}
        <Modal
          visible={showCityModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowCityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select City</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.modalItem,
                      formData.city === city && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      updateField('city', city)
                      setShowCityModal(false)
                    }}
                  >
                    <Text style={styles.modalItemIcon}>📍</Text>
                    <Text style={styles.modalItemText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setShowCityModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  gradientHeader: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: '#DBEAFE',
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  phonePrefix: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  phonePrefixText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  phoneInput: {
    borderWidth: 0,
    borderRadius: 0,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.borderLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  typeChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: COLORS.primaryDark,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  selectorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  selectorPlaceholder: {
    color: COLORS.textLight,
  },
  selectorArrow: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  loginRow: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  loginText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xxl,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  modalItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  modalItemIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  modalItemText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalClose: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  modalCloseText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
})
