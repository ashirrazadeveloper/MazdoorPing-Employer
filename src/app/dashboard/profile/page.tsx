'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone,
  MapPin,
  Building2,
  Edit3,
  Star,
  Briefcase,
  DollarSign,
  Heart,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockEmployer, mockJobs } from '@/lib/mock-data';
import { formatPKR, getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const employer = mockEmployer;
  const [editing, setEditing] = useState(false);

  const completedJobs = mockJobs.filter((j) => j.status === 'completed').length;
  const activeJobs = mockJobs.filter((j) => j.status === 'open' || j.status === 'in_progress').length;

  const menuItems = [
    { icon: Briefcase, label: 'My Bookings', value: `${mockJobs.length} jobs`, href: '/my-bookings' },
    { icon: Heart, label: 'Saved Workers', value: `${employer.saved_workers_count} workers`, href: '/favorites' },
    { icon: Star, label: 'Reviews Given', value: `${employer.avg_rating_given} avg`, href: '#' },
    { icon: DollarSign, label: 'Spending Summary', value: formatPKR(employer.total_spent), href: '#' },
    { icon: Shield, label: 'Privacy & Settings', value: '', href: '#' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('mazdoorping_user');
    router.push('/login');
  };

  return (
    <>
      <Header title="Profile" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              {getInitials(employer.name)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{employer.name}</h2>
              {employer.company_name && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" /> {employer.company_name}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {employer.city}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {employer.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            <div className="text-center p-2.5 bg-gray-50 rounded-xl">
              <p className="text-base font-bold text-gray-900">{mockJobs.length}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Total</p>
            </div>
            <div className="text-center p-2.5 bg-blue-50 rounded-xl">
              <p className="text-base font-bold text-primary">{activeJobs}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Active</p>
            </div>
            <div className="text-center p-2.5 bg-green-50 rounded-xl">
              <p className="text-base font-bold text-green-600">{completedJobs}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Done</p>
            </div>
            <div className="text-center p-2.5 bg-amber-50 rounded-xl">
              <p className="text-base font-bold text-amber-600">{employer.avg_rating_given}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Rating</p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        {editing ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Edit Profile</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
              <input
                type="text"
                defaultValue={employer.name}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue={employer.email}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
              <input
                type="tel"
                defaultValue={employer.phone}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Company Name</label>
              <input
                type="text"
                defaultValue={employer.company_name || ''}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-xs text-gray-400">{item.value}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-red-100 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Log Out</span>
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          MazdoorPing Employer App v1.0.0
        </p>
      </div>
    </>
  );
}
