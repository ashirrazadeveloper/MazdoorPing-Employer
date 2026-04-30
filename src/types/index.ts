export type WorkerCategory =
  | 'Plumber'
  | 'Electrician'
  | 'Carpenter'
  | 'Painter'
  | 'Mason'
  | 'Welder'
  | 'AC Technician'
  | 'Cleaner'
  | 'Driver'
  | 'Laborer'
  | 'Gardener'
  | 'Tailor'
  | 'Mechanic'
  | 'Locksmith';

export const WORKER_CATEGORIES: WorkerCategory[] = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Mason',
  'Welder',
  'AC Technician',
  'Cleaner',
  'Driver',
  'Laborer',
  'Gardener',
  'Tailor',
  'Mechanic',
  'Locksmith',
];

export const CATEGORY_ICONS: Record<string, string> = {
  Plumber: '🔧',
  Electrician: '⚡',
  Carpenter: '🪚',
  Painter: '🎨',
  Mason: '🧱',
  Welder: '🔥',
  'AC Technician': '❄️',
  Cleaner: '🧹',
  Driver: '🚗',
  Laborer: '👷',
  Gardener: '🌿',
  Tailor: '🧵',
  Mechanic: '🔩',
  Locksmith: '🔑',
};

export const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
];

export type BusinessType =
  | 'construction'
  | 'interior_design'
  | 'property_management'
  | 'manufacturing'
  | 'retail'
  | 'restaurant'
  | 'hospitality'
  | 'technology'
  | 'transportation'
  | 'agriculture'
  | 'other';

export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: 'construction', label: 'Construction' },
  { value: 'interior_design', label: 'Interior Design' },
  { value: 'property_management', label: 'Property Management' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'restaurant', label: 'Restaurant / Food' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'technology', label: 'Technology' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' },
];

export type BudgetType = 'hourly' | 'daily' | 'fixed' | 'negotiable';
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type UrgencyLevel = 'normal' | 'urgent' | 'emergency';

// Supabase-aligned types
export interface Category {
  id: string;
  name: string;
  name_ur: string | null;
  icon: string | null;
  description: string | null;
  base_rate: number;
  commission_rate: number;
  is_active: boolean;
  total_workers: number;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string;
  company_name: string | null;
  business_type: string | null;
  city: string;
  area: string | null;
  rating: number;
  total_reviews: number;
  total_jobs_posted: number;
  total_spent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  saved_workers_count?: number;
}

export interface Worker {
  id: string;
  full_name: string;
  category_id: string | null;
  category?: Category;
  city: string;
  area: string | null;
  bio: string | null;
  experience_years: number;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  base_rate: number;
  status: string;
  is_verified: boolean;
  is_available: boolean;
  latitude: number | null;
  longitude: number | null;
  avatar_url?: string | null;
  phone?: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  worker_id: string | null;
  category_id: string;
  category?: Category;
  title: string;
  description: string | null;
  budget_type: BudgetType;
  budget_min: number | null;
  budget_max: number | null;
  city: string;
  area: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: JobStatus;
  urgency: UrgencyLevel;
  workers_needed: number;
  duration: string | null;
  skills_required: string[] | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  final_price: number | null;
  commission: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  bids_count?: number;
  // Joined fields
  employer?: { full_name: string; company_name: string | null };
  worker?: { full_name: string; rating: number; experience_years: number; phone?: string | null };
  bids?: Bid[];
}

export interface Bid {
  id: string;
  job_id: string;
  worker_id: string;
  amount: number;
  message: string | null;
  estimated_duration: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Joined
  worker?: {
    id: string;
    full_name: string;
    rating: number;
    experience_years: number;
    total_jobs: number;
    avatar_url: string | null;
    category?: Category;
  };
}

export interface Review {
  id: string;
  job_id: string;
  worker_id: string;
  employer_id: string;
  employer_name: string;
  rating: number;
  comment: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}
