'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusCircle,
  Briefcase,
  Heart,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/post-job', label: 'Post Job', icon: PlusCircle },
  { href: '/dashboard/my-bookings', label: 'My Jobs', icon: Briefcase },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/find-workers';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isPostJob = item.href === '/dashboard/post-job';

          if (isPostJob) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 active:scale-95 transition-transform">
                  <PlusCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-semibold text-primary mt-1">Post</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px]',
                active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon
                className={cn('w-5 h-5 transition-all', active && 'scale-110')}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn('text-[10px]', active ? 'font-semibold' : 'font-medium')}>
                {item.label}
              </span>
              {active && (
                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
