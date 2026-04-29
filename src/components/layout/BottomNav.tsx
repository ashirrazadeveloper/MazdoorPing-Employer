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
  { href: '/', label: 'Home', icon: Home },
  { href: '/post-job', label: 'Post Job', icon: PlusCircle },
  { href: '/my-bookings', label: 'My Jobs', icon: Briefcase },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/find-workers';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[60px]',
                active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon
                className={cn('w-5 h-5', active && 'fill-primary/10')}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
