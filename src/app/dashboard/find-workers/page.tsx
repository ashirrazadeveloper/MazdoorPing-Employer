'use client';

import { Suspense } from 'react';
import FindWorkersContent from './FindWorkersContent';

export default function FindWorkersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FindWorkersContent />
    </Suspense>
  );
}
