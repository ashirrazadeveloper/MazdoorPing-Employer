# MazdoorPing Employer App

**Pakistan's #1 GPS Labor Marketplace — Employer Side**

## Overview

MazdoorPing Employer is the employer-facing mobile application for Pakistan's premier labor marketplace. Employers use this app to find skilled workers, post jobs, book workers, rate them, and manage all their bookings.

## Tech Stack

- **React Native + Expo** (SDK 52)
- **TypeScript** 5.7
- **Supabase** (Authentication, Database, Storage)
- **React Navigation** (Bottom Tabs + Native Stack)
- **expo-location** (Location services)
- **expo-image-picker** (Photo uploads)

## Features

- 🔐 **Phone OTP Authentication** — Secure login via SMS verification
- 👷 **Find Workers** — Search and browse available workers by category, city, and name
- 📋 **Post Jobs** — Create job listings with category, rate, location, urgency, and payment method
- 📁 **My Bookings** — Track all posted jobs with status tabs (All, Active, Completed)
- ⭐ **Rate Workers** — Star rating (1-5) with comments for completed jobs
- ❤️ **Favorites** — Save preferred workers for quick booking
- 📂 **Categories** — Browse 14 labor categories with Urdu names and worker counts
- 🔔 **Notifications** — Real-time alerts for job updates, worker acceptance, and completions
- 👤 **Profile Management** — Edit employer profile, verification status, settings

## Color Theme

Blue theme (#3B82F6 primary) — distinct from the Worker app's green theme.

## Supabase Tables

### `employers`
```
id, name, phone, email, type, city, area, verified, created_at
```

### `jobs`
```
id, title, category, description, rate, rate_type, status, city, area, address, urgent, payment_method, payment_status, worker_id, employer_id, created_at, completed_at
```

### `workers`
```
id, name, phone, email, cnic, photo, category, experience, rate, rate_type, rating, total_jobs, available, city, area, language, verified, premium, balance, total_earned, lat, lng, bio, created_at
```

### `reviews`
```
id, rating, comment, job_id, worker_id, employer_id, created_at
```

### `notifications`
```
id, title, message, type, read, employer_id, worker_id, created_at
```

### `favorites`
```
id, employer_id, worker_id, created_at
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example` with your Supabase credentials
4. Start the development server: `npx expo start`

## Demo Mode

The app includes a full demo mode accessible via the "Skip — Enter Demo Mode" button on the login screen. Demo mode provides sample data for all screens without requiring a Supabase connection.

## Project Structure

```
src/
├── lib/supabase.ts          # Supabase client
├── types/index.ts           # TypeScript interfaces
├── utils/
│   ├── formatPKR.ts         # Currency formatting
│   └── constants.ts         # Colors, categories, cities
├── context/AuthContext.tsx   # Authentication state
├── hooks/
│   ├── useAuth.ts           # Auth hook
│   ├── useJobs.ts           # Jobs CRUD
│   ├── useWorkers.ts        # Workers & favorites
│   └── useNotifications.ts  # Notifications
├── navigation/AppNavigator.tsx
├── components/              # Reusable UI components
└── screens/                 # Screen components
    ├── Auth/                # Login, Register
    ├── Home/                # Dashboard
    ├── Workers/             # Find & worker details
    ├── Jobs/                # Post, bookings, details
    ├── Categories/          # Category browser
    ├── Favorites/           # Saved workers
    ├── Reviews/             # Rate workers
    ├── Notifications/       # Alerts
    └── Profile/             # Employer profile
```

## Navigation

Bottom tabs: **Home** | **Find Workers** | **Post Job** | **Bookings** | **Profile**

Stack screens accessible from tabs: Worker Detail, Job Detail, Categories, Favorites, Rate Worker, Notifications.
