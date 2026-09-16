'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { QueryProvider } from '@/components/query-provider';
import { ErrorBoundary } from '@/components/error-boundary';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}