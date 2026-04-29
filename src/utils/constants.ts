export const CATEGORIES = [
  { name: 'Painter', nameUrdu: 'پینٹر', icon: '🎨', demand: 10 },
  { name: 'Electrician', nameUrdu: 'بجلی کا کام', icon: '⚡', demand: 9 },
  { name: 'Plumber', nameUrdu: 'پلمبر', icon: '🔧', demand: 8 },
  { name: 'Mason', nameUrdu: 'راج', icon: '🧱', demand: 7 },
  { name: 'Carpenter', nameUrdu: 'تختی', icon: '🪚', demand: 8 },
  { name: 'Welder', nameUrdu: 'ولڈر', icon: '🔥', demand: 6 },
  { name: 'Tile Fixer', nameUrdu: 'ٹائل فکسر', icon: '🔲', demand: 7 },
  { name: 'POP Ceiling', nameUrdu: 'پاپ سیلنگ', icon: '🏠', demand: 6 },
  { name: 'Gardener', nameUrdu: 'باغبان', icon: '🌿', demand: 5 },
  { name: 'Cleaner', nameUrdu: 'صفائی', icon: '🧹', demand: 5 },
  { name: 'Mover', nameUrdu: 'منقولات', icon: '📦', demand: 4 },
  { name: 'AC Technician', nameUrdu: 'اے سی ٹیکنیشن', icon: '❄️', demand: 9 },
  { name: 'Glass Worker', nameUrdu: 'شیشہ', icon: '🪟', demand: 4 },
  { name: 'General Helper', nameUrdu: 'ہیلپر', icon: '👷', demand: 10 },
]

export const CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
]

export const COMMISSION_RATE = 0.12 // 12%

export const COLORS = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryDarker: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#F59E0B',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(0, 0, 0, 0.08)',
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  huge: 36,
}

export const JOB_STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  accepted: '#3B82F6',
  in_progress: '#10B981',
  completed: '#10B981',
  cancelled: '#EF4444',
  disputed: '#EF4444',
}

export const JOB_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
}

export const PAYMENT_METHODS = [
  { label: 'Cash', value: 'cash', icon: '💵' },
  { label: 'EasyPaisa', value: 'easypaisa', icon: '📱' },
  { label: 'JazzCash', value: 'jazzcash', icon: '📲' },
  { label: 'Bank Transfer', value: 'bank_transfer', icon: '🏦' },
]
