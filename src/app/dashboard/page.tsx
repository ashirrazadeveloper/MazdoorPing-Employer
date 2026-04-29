'use client';

import Link from 'next/link';
import {
  Briefcase,
  DollarSign,
  Users,
  Star,
  PlusCircle,
  Search,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockEmployer, mockJobs } from '@/lib/mock-data';
import { WORKER_CATEGORIES, CATEGORY_ICONS } from '@/types';
import { formatPKR, cn } from '@/lib/utils';
import type { WorkerCategory } from '@/types';

const statusColors: Record<string, string> = {
  open: 'bg-green-50 text-green-700 border-green-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-gray-50 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function DashboardPage() {
  const employer = mockEmployer;
  const activeJobs = mockJobs.filter((j) => j.status === 'open' || j.status === 'in_progress');
  const recentJobs = mockJobs.slice(0, 3);

  const stats = [
    { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase, color: 'text-primary bg-primary-light' },
    { label: 'Total Spent', value: formatPKR(employer.total_spent), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Saved Workers', value: employer.saved_workers_count, icon: Users, color: 'text-orange-600 bg-orange-50' },
    { label: 'Avg Rating', value: employer.avg_rating_given.toFixed(1), icon: Star, color: 'text-amber-600 bg-amber-50' },
  ];

  const quickActions = [
    { label: 'Post a Job', icon: PlusCircle, href: '/dashboard/post-job', color: 'bg-primary text-white' },
    { label: 'Find Workers', icon: Search, href: '/dashboard/find-workers', color: 'bg-white text-primary border-2 border-primary' },
    { label: 'My Bookings', icon: Briefcase, href: '/dashboard/my-bookings', color: 'bg-white text-primary border-2 border-primary' },
  ];

  return (
    <>
      <Header />
      <div className="px-4 py-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', stat.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="flex gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95',
                    action.color
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-semibold">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Browse by Category */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Browse Workers</h2>
            <Link href="/dashboard/find-workers" className="text-primary text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {WORKER_CATEGORIES.slice(0, 8).map((category) => (
              <Link
                key={category}
                href={`/dashboard/find-workers?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors"
              >
                <span className="text-xl">{CATEGORY_ICONS[category as WorkerCategory]}</span>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{category}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Job Postings</h2>
            <Link href="/dashboard/my-bookings" className="text-primary text-sm font-medium flex items-center gap-1">
              All Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/bookings/${job.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {CATEGORY_ICONS[job.category]} {job.category} &bull; {job.city}
                    </p>
                  </div>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', statusColors[job.status])}>
                    {statusLabels[job.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{formatPKR(job.budget_amount)}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.bids_count} bids
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
