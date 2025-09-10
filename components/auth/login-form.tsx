/**
 * @fileoverview Login Form Component for ALX Polly Application
 * 
 * Provides a secure, accessible login form with validation and loading states.
 * Integrates with the authentication system to handle user sign-in operations.
 * 
 * Features:
 * - Form validation with required field checking
 * - Loading state management during authentication
 * - Accessible form controls with proper labels
 * - Responsive design with error handling
 * 
 * @author ALX Polly Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginCredentials } from '@/types';

/**
 * Props interface for the LoginForm component
 */
interface LoginFormProps {
  /** 
   * Callback function to handle login submission
   * Called with validated credentials when form is submitted
   */
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  /** 
   * Loading state indicator to disable form during authentication
   * Prevents multiple submissions and provides user feedback
   */
  isLoading?: boolean;
}

/**
 * Login Form Component
 * 
 * A comprehensive login form that handles user authentication with proper
 * validation, accessibility features, and loading states. The form prevents
 * submission when required fields are empty and provides visual feedback
 * during the authentication process.
 * 
 * @param props - Component props containing login handler and loading state
 * @returns JSX element representing the login form
 * 
 * @example
 * ```tsx
 * <LoginForm 
 *   onLogin={handleLogin}
 *   isLoading={authLoading}
 * />
 * ```
 */
export function LoginForm({ onLogin, isLoading = false }: LoginFormProps) {
  // Form state management for user credentials
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  /**
   * Handles form submission with validation
   * 
   * Prevents default form submission, validates that both email and password
   * are provided, then calls the onLogin callback with the credentials.
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - ensure both fields have values
    if (!credentials.email.trim() || !credentials.password.trim()) {
      console.warn('[LoginForm] Submission attempted with empty credentials');
      return;
    }
    
    console.log('[LoginForm] Submitting login form for:', credentials.email);
    await onLogin(credentials);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
