# MazdoorPing Employer App

**"Uber for Daily Wage Workers"** — Employer-facing web application for Pakistan.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom blue theme (#2563EB)
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **Icons**: Lucide React

## Features
- 🔐 Authentication (Login/Register with Supabase Auth)
- 📊 Dashboard with stats, categories, and quick actions
- 📝 Multi-step job posting (5 steps)
- 🔍 Find workers with search, filter, and sort
- 👷 Worker detail profiles with reviews and ratings
- 📋 My Bookings with tabs (Active, In Progress, Completed, Cancelled)
- 📄 Job detail with bid management (Accept/Reject)
- ❤️ Save favorite workers for quick rehire
- 👤 Profile management with spending summary
- 🔔 Real-time notifications
- ⭐ Rate workers with star ratings and reviews

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## Project Structure
```
src/
  app/
    layout.tsx            # Root layout
    page.tsx              # Entry (redirect)
    login/page.tsx        # Login page
    register/page.tsx     # Registration page
    (dashboard)/          # Authenticated routes
      layout.tsx          # Bottom nav layout
      page.tsx            # Home/Dashboard
      post-job/page.tsx   # Multi-step job posting
      find-workers/       # Worker search
      workers/[id]/       # Worker detail
      my-bookings/        # Job listings
      bookings/[id]/      # Job detail with bids
      favorites/          # Saved workers
      profile/            # Employer profile
      notifications/      # Notification center
      rate/[id]/          # Rate worker
  components/
    layout/BottomNav.tsx  # Bottom navigation
    layout/Header.tsx     # Page header
    workers/WorkerCard.tsx
  lib/
    supabase.ts           # Supabase client
    mock-data.ts          # Demo/mock data
    utils.ts              # Utility functions
  types/index.ts          # TypeScript types
```

## Demo Mode
When Supabase is not configured, the app uses comprehensive mock data for all features.

## Deployment
Ready for deployment on [Vercel](https://vercel.com).
