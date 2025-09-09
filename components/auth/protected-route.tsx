'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login', 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        console.log('ProtectedRoute: User not authenticated, redirecting to', redirectTo);
        setRedirecting(true);
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        console.log('ProtectedRoute: User authenticated but on public route, redirecting to dashboard');
        setRedirecting(true);
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, redirectTo, requireAuth]);

  if (loading || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!requireAuth && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
