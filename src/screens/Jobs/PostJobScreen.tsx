import React, { useState, useEffect } from 'react'
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
  Switch,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { useJobs } from '../../hooks/useJobs'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  COLORS, SPACING, FONT_SIZES, CATEGORIES, CITIES, PAYMENT_METHODS,
} from '../../utils/constants'
import { Employer } from '../../types'

interface PostJobScreenProps {
  navigation: any
  route?: any
}

export default function PostJobScreen({ navigation, route }: PostJobScreenProps) {
  const { employer, demoMode } = useAuth()
  const { createJob, loading } = useJobs()
  const [formData, setFormData] = useState({
    title: '',
    category: route?.params?.prefillCategory || '',
    description: '',
    rate: '',
    rate_type: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly',
    city: '',
    area: '',
    address: '',
    urgent: false,
    payment_method: 'cash',
  })
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a job title')
      return
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category')
      return
    }
    if (!formData.rate || parseInt(formData.rate) <= 0) {
      Alert.alert('Error', 'Please enter a valid rate')
      return
    }
    if (!formData.city) {
      Alert.alert('Error', 'Please select a city')
      return
    }

    if (demoMode) {
      Alert.alert('Demo Mode', 'Job posted successfully! (Demo)')
      navigation.goBack()
      return
    }

    const employerId = employer?.id
    if (!employerId) {
      Alert.alert('Error', 'Please login first')
      return
    }

    const success = await createJob({
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description || undefined,
      rate: parseInt(formData.rate),
      rate_type: formData.rate_type,
      city: formData.city,
      area: formData.area || undefined,
      address: formData.address || undefined,
      urgent: formData.urgent,
      payment_method: formData.payment_method,
      payment_status: 'pending',
      status: 'pending',
      employer_id: employerId,
    })

    if (success) {
      Alert.alert('Success', 'Job posted successfully! Workers will be notified.')
      navigation.goBack()
    } else {
      Alert.alert('Error', 'Failed to post job. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post a Job</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Paint 3 rooms in DHA"
              placeholderTextColor={COLORS.textLight}
              value={formData.title}
              onChangeText={(v) => updateField('title', v)}
            />
          </View>

          {/* Category */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowCategoryModal(true)}>
              <Text style={[styles.selectorText, !formData.category && styles.selectorPlaceholder]}>
                {formData.category
                  ? `${CATEGORIES.find((c) => c.name === formData.category)?.icon} ${formData.category}`
                  : 'Select category'}
              </Text>
              <Text style={styles.selectorArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the job requirements..."
              placeholderTextColor={COLORS.textLight}
              value={formData.description}
              onChangeText={(v) => updateField('description', v)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Rate & Rate Type */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Rate (Rs.) *</Text>
              <TextInput
                style={styles.input}
                placeholder="1500"
                placeholderTextColor={COLORS.textLight}
                value={formData.rate}
                onChangeText={(v) => updateField('rate', v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Rate Type</Text>
              <View style={styles.rateTypeRow}>
                {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.rateTypeChip, formData.rate_type === type && styles.rateTypeChipActive]}
                    onPress={() => updateField('rate_type', type)}
                  >
                    <Text style={[styles.rateTypeText, formData.rate_type === type && styles.rateTypeTextActive]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* City */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowCityModal(true)}>
              <Text style={[styles.selectorText, !formData.city && styles.selectorPlaceholder]}>
                {formData.city || 'Select city'}
              </Text>
              <Text style={styles.selectorArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Area */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., DHA Phase 5, Johar Town"
              placeholderTextColor={COLORS.textLight}
              value={formData.area}
              onChangeText={(v) => updateField('area', v)}
            />
          </View>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput
              style={styles.input}
              placeholder="House #, Street, Area"
              placeholderTextColor={COLORS.textLight}
              value={formData.address}
              onChangeText={(v) => updateField('address', v)}
            />
          </View>

          {/* Urgent Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>🚨 Urgent Job</Text>
              <Text style={styles.toggleSubtitle}>Workers will see this as a priority</Text>
            </View>
            <Switch
              value={formData.urgent}
              onValueChange={(v) => updateField('urgent', v)}
              trackColor={{ false: COLORS.border, true: COLORS.danger }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Payment Method */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowPaymentModal(true)}>
              <Text style={[styles.selectorText, !formData.payment_method && styles.selectorPlaceholder]}>
                {PAYMENT_METHODS.find((p) => p.value === formData.payment_method)?.icon}{' '}
                {PAYMENT_METHODS.find((p) => p.value === formData.payment_method)?.label || 'Select'}
              </Text>
              <Text style={styles.selectorArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <LoadingSpinner size={24} color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>📋 Post Job</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Category Modal */}
        <Modal visible={showCategoryModal} animationType="slide" transparent onRequestClose={() => setShowCategoryModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.name}
                    style={[styles.modalItem, formData.category === cat.name && styles.modalItemActive]}
                    onPress={() => { updateField('category', cat.name); setShowCategoryModal(false) }}
                  >
                    <Text style={styles.modalItemIcon}>{cat.icon}</Text>
                    <Text style={styles.modalItemText}>{cat.name}</Text>
                    <Text style={styles.modalItemUrdu}>{cat.nameUrdu}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* City Modal */}
        <Modal visible={showCityModal} animationType="slide" transparent onRequestClose={() => setShowCityModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select City</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[styles.modalItem, formData.city === city && styles.modalItemActive]}
                    onPress={() => { updateField('city', city); setShowCityModal(false) }}
                  >
                    <Text style={styles.modalItemIcon}>📍</Text>
                    <Text style={styles.modalItemText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowCityModal(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Payment Modal */}
        <Modal visible={showPaymentModal} animationType="slide" transparent onRequestClose={() => setShowPaymentModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Payment Method</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {PAYMENT_METHODS.map((pm) => (
                  <TouchableOpacity
                    key={pm.value}
                    style={[styles.modalItem, formData.payment_method === pm.value && styles.modalItemActive]}
                    onPress={() => { updateField('payment_method', pm.value); setShowPaymentModal(false) }}
                  >
                    <Text style={styles.modalItemIcon}>{pm.icon}</Text>
                    <Text style={styles.modalItemText}>{pm.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.modalClose}>
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
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  fieldGroup: { marginBottom: SPACING.md },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, fontSize: FONT_SIZES.md, color: COLORS.text, borderWidth: 1.5, borderColor: COLORS.border },
  textArea: { height: 100 },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border },
  selectorText: { fontSize: FONT_SIZES.md, color: COLORS.text },
  selectorPlaceholder: { color: COLORS.textLight },
  selectorArrow: { fontSize: 18, color: COLORS.textLight },
  row: { flexDirection: 'row', gap: SPACING.md },
  rateTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  rateTypeChip: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 16, backgroundColor: COLORS.borderLight, borderWidth: 1, borderColor: COLORS.border },
  rateTypeChipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  rateTypeText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  rateTypeTextActive: { color: COLORS.primaryDark },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, borderWidth: 1.5, borderColor: COLORS.border, marginBottom: SPACING.md },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  toggleSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: SPACING.lg, alignItems: 'center', marginTop: SPACING.lg, shadowColor: 'rgba(59,130,246,0.3)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4 },
  submitBtnText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xxl, maxHeight: '70%' },
  modalTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  modalItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm },
  modalItemActive: { backgroundColor: COLORS.primaryLight },
  modalItemIcon: { fontSize: 24, marginRight: SPACING.md },
  modalItemText: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  modalItemUrdu: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginLeft: SPACING.sm },
  modalClose: { paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  modalCloseText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
})
