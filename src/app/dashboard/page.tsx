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
  MapPin,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockEmployer, mockJobs } from '@/lib/mock-data';
import { WORKER_CATEGORIES, CATEGORY_ICONS } from '@/types';
import { formatPKR, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { WorkerCategory } from '@/types';

const statusColors: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-gray-50 text-gray-600 border border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
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
    { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase, color: 'text-blue-600 bg-blue-50', ring: 'ring-blue-100' },
    { label: 'Total Spent', value: formatPKR(employer.total_spent), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', ring: 'ring-emerald-100' },
    { label: 'Saved Workers', value: employer.saved_workers_count, icon: Users, color: 'text-orange-600 bg-orange-50', ring: 'ring-orange-100' },
    { label: 'Avg Rating', value: employer.avg_rating_given.toFixed(1), icon: Star, color: 'text-amber-600 bg-amber-50', ring: 'ring-amber-100' },
  ];

  const quickActions = [
    { label: 'Post a Job', icon: PlusCircle, href: '/dashboard/post-job', gradient: 'from-blue-600 to-blue-700' },
    { label: 'Find Workers', icon: Search, href: '/dashboard/find-workers', gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'My Bookings', icon: Briefcase, href: '/dashboard/my-bookings', gradient: 'from-violet-500 to-violet-600' },
  ];

  return (
    <>
      <Header />
      <div className="px-4 py-5 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 ring-4', stat.color, stat.ring)}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in animate-delay-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="flex gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex-1 flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl shadow-sm border border-gray-100/80 hover:shadow-md transition-all active:scale-95"
                >
                  <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', action.gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Browse Workers by Category */}
        <div className="animate-fade-in animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Browse Workers</h2>
            <Link href="/dashboard/find-workers" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
            {WORKER_CATEGORIES.slice(0, 8).map((category) => (
              <Link
                key={category}
                href={`/dashboard/find-workers?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl shadow-sm border border-gray-100/80 hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
              >
                <span className="text-2xl">{CATEGORY_ICONS[category as WorkerCategory]}</span>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{category}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Job Postings */}
        <div className="animate-fade-in animate-delay-300">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Job Postings</h2>
            <Link href="/dashboard/my-bookings" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
              All Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/bookings/${job.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {CATEGORY_ICONS[job.category]} {job.category} &bull; {job.city}
                    </p>
                  </div>
                  <Badge className={cn('text-[10px]', statusColors[job.status])} variant="secondary">
                    {statusLabels[job.status]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{formatPKR(job.budget_amount)}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {job.area && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.area}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
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
