import { Suspense } from 'react';
import { RevenueDashboard } from '@/components/dashboard/RevenueDashboard';
import { LoadingSkeleton } from '@/components/states/LoadingSkeleton';

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton height={600} />}>
      <RevenueDashboard />
    </Suspense>
  );
}
