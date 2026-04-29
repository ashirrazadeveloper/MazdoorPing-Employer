'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has a session (using localStorage as simple auth check)
    const user = localStorage.getItem('mazdoorping_user');
    if (user) {
      router.replace('/post-job'); // Will show dashboard since it's the (dashboard) layout index
    } else {
      router.replace('/login');
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return null;
}
