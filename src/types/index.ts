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

export const CATEGORY_ICONS: Record<WorkerCategory, string> = {
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
  Gardener: '🌱',
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
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type UrgencyLevel = 'normal' | 'urgent' | 'very_urgent';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  city: string;
  company_name?: string;
  business_type?: BusinessType;
  role: 'employer' | 'worker';
  avatar_url?: string;
  created_at: string;
}

export interface EmployerProfile extends User {
  role: 'employer';
  total_spent: number;
  jobs_posted: number;
  avg_rating_given: number;
  saved_workers_count: number;
}

export interface Worker {
  id: string;
  name: string;
  category: WorkerCategory;
  city: string;
  area?: string;
  rating: number;
  total_reviews: number;
  experience_years: number;
  hourly_rate: number;
  daily_rate: number;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  skills: string[];
  is_available: boolean;
  completed_jobs: number;
  created_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  employer_name: string;
  category: WorkerCategory;
  title: string;
  description: string;
  budget_type: BudgetType;
  budget_amount: number;
  city: string;
  area?: string;
  address?: string;
  date: string;
  time?: string;
  urgency: UrgencyLevel;
  workers_needed: number;
  duration?: string;
  skills_required: string[];
  status: JobStatus;
  accepted_bid_id?: string;
  created_at: string;
  bids_count: number;
}

export interface Bid {
  id: string;
  job_id: string;
  worker_id: string;
  worker: Worker;
  amount: number;
  message: string;
  estimated_duration?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Review {
  id: string;
  job_id: string;
  worker_id: string;
  employer_id: string;
  employer_name: string;
  rating: number;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_bid' | 'bid_accepted' | 'bid_rejected' | 'job_completed' | 'new_review' | 'system';
  title: string;
  message: string;
  read: boolean;
  related_id?: string;
  created_at: string;
}
