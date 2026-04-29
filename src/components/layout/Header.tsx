'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function Header({ title, showBack, showNotifications, showMenu }: {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
}) {
  const router = useRouter();
  const [userName, setUserName] = React.useState('Employer');

  React.useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('mazdoorping_user') || '{}');
      if (user.name) setUserName(user.name);
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mazdoorping_user');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold">
                {getInitials(userName)}
              </div>
              <div>
                <p className="text-xs text-gray-400">Welcome back</p>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showNotifications !== false && (
            <button
              onClick={() => router.push('/dashboard/notifications')}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>
          )}
          {showMenu && (
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
