import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants'
import LoadingSpinner from '../../components/LoadingSpinner'

const { width } = Dimensions.get('window')

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const { signIn, verifyOTP, setDemoMode, demoMode } = useAuth()

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      const fullPhone = phone.startsWith('+92') ? phone : `+92${phone}`
      await signIn(fullPhone)
      setStep('otp')
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const fullPhone = phone.startsWith('+92') ? phone : `+92${phone}`
      await verifyOTP(fullPhone, otp)
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoMode = () => {
    setDemoMode(true)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>👷</Text>
          </View>
          <Text style={styles.appName}>MazdoorPing</Text>
          <Text style={styles.tagline}>Pakistan's #1 Labor Marketplace</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EMPLOYER APP</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {step === 'phone' ? (
            <>
              <Text style={styles.sectionTitle}>Login as Employer</Text>
              <Text style={styles.sectionSubtitle}>
                Enter your phone number to login
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+92</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="3XX XXXXXXX"
                  placeholderTextColor={COLORS.textLight}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={11}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendOTP}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <LoadingSpinner size={24} color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Verify OTP</Text>
              <Text style={styles.sectionSubtitle}>
                Enter the 6-digit code sent to +92{phone}
              </Text>

              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="Enter OTP"
                placeholderTextColor={COLORS.textLight}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOTP}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <LoadingSpinner size={24} color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setStep('phone')
                  setOtp('')
                }}
              >
                <Text style={styles.linkText}>Change phone number</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSendOTP} style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive? </Text>
                <Text style={styles.linkText}>Resend OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Demo Mode */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoMode}
            activeOpacity={0.7}
          >
            <Text style={styles.demoButtonText}>🎮 Skip — Enter Demo Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerRow}
          >
            <Text style={styles.registerText}>
              New employer?{' '}
              <Text style={styles.linkText}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: FONT_SIZES.huge,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 1,
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  phonePrefix: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  phonePrefixText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '700',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.sm,
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  bottomSection: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  demoButton: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  demoButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  registerRow: {
    marginTop: SPACING.sm,
  },
  registerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
})
