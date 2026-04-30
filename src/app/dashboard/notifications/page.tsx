'use client';

import { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Briefcase,
  Star,
  MessageSquare,
  Info,
  CheckCheck,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockNotifications } from '@/lib/mock-data';
import { formatRelativeTime, cn } from '@/lib/utils';

const typeIcons: Record<string, typeof Bell> = {
  new_bid: Briefcase,
  bid_accepted: CheckCircle,
  bid_rejected: MessageSquare,
  job_completed: CheckCircle,
  new_review: Star,
  system: Info,
};

const typeColors: Record<string, string> = {
  new_bid: 'bg-blue-50 text-blue-600',
  bid_accepted: 'bg-green-50 text-green-600',
  bid_rejected: 'bg-red-50 text-red-500',
  job_completed: 'bg-emerald-50 text-emerald-600',
  new_review: 'bg-amber-50 text-amber-600',
  system: 'bg-gray-100 text-gray-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <>
      <Header title="Notifications" showBack showNotifications={false} />
      <div className="px-4 py-4 space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95',
                  filter === f
                    ? 'bg-primary text-white shadow-sm shadow-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
                )}
              >
                {f === 'all' ? 'All' : 'Unread'}
                <span className="ml-1.5 opacity-80">
                  {f === 'all'
                    ? notifications.length
                    : notifications.filter((n) => !n.read).length}
                </span>
              </button>
            ))}
          </div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((notification) => {
              const Icon = typeIcons[notification.type] || Bell;
              const colorClass = typeColors[notification.type] || 'bg-gray-100 text-gray-500';

              return (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'w-full text-left bg-white rounded-2xl p-4 shadow-sm border transition-all active:scale-[0.99]',
                    notification.read
                      ? 'border-gray-100'
                      : 'border-blue-100 bg-blue-50/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={cn(
                          'text-sm truncate',
                          notification.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notification.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatRelativeTime(notification.created_at)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {filter === 'unread'
                ? 'You\'re all caught up!'
                : 'We\'ll notify you about new bids, job updates, and more.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
