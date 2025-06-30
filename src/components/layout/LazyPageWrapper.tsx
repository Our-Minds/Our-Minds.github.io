
import { Suspense } from 'react';
import { PageLoadingSkeleton } from '@/components/ui/loading-skeleton';

interface LazyPageWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
}

export function LazyPageWrapper({ 
  children, 
  fallback: FallbackComponent = PageLoadingSkeleton 
}: LazyPageWrapperProps) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      {children}
    </Suspense>
  );
}
