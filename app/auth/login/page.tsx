'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await signIn(credentials.email, credentials.password);
      
      if (error) {
        setError(error.message || 'Failed to sign in');
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-primary hover:text-primary/80"
              >
                create a new account
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
          
          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
