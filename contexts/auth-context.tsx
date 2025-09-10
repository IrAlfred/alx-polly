/**
 * @fileoverview Authentication Context for ALX Polly Application
 * 
 * This module provides comprehensive authentication state management using Supabase Auth.
 * It handles user session management, JWT token refresh, and provides a clean interface
 * for authentication operations throughout the application.
 * 
 * Key Features:
 * - Automatic session persistence and restoration
 * - JWT token refresh handling
 * - User state synchronization across components
 * - Secure sign-in/sign-up/sign-out operations
 * - Authentication state loading management
 * 
 * @author ALX Polly Team
 * @version 1.0.0
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Represents the authenticated user data structure
 * Normalized from Supabase user object for consistent usage across the app
 */
interface AuthUser {
  /** Unique user identifier from Supabase Auth */
  id: string;
  /** User's email address (always available) */
  email: string;
  /** Display name (from metadata or derived from email) */
  name: string;
  /** Optional avatar URL from user metadata */
  avatar?: string;
}

/**
 * Authentication context type definition
 * Provides all authentication state and operations to consuming components
 */
interface AuthContextType {
  /** Current authenticated user or null if not authenticated */
  user: AuthUser | null;
  /** Raw Supabase session object containing JWT and metadata */
  session: any;
  /** Loading state indicator for authentication operations */
  loading: boolean;
  /** 
   * Register a new user account
   * @param email - User's email address
   * @param password - User's password (min 6 characters)
   * @param name - Display name for the user
   * @returns Promise with error object if registration fails
   */
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  /** 
   * Sign in an existing user
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise with error object if sign-in fails
   */
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  /** 
   * Sign out the current user and clear session
   * @returns Promise that resolves when sign-out is complete
   */
  signOut: () => Promise<void>;
}

/**
 * Authentication context instance
 * Use via useAuth hook rather than consuming directly
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook for accessing authentication context
 * 
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType with current auth state and operations
 * 
 * @example
 * ```tsx
 * const { user, signIn, loading } = useAuth();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (!user) return <LoginForm onSubmit={signIn} />;
 * return <Dashboard user={user} />;
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  /** Child components that need access to authentication context */
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Wraps the application and provides authentication context to all child components.
 * Handles session initialization, persistence, and synchronization with Supabase Auth.
 * 
 * Features:
 * - Automatic session restoration on app load
 * - Real-time authentication state synchronization
 * - JWT token refresh handling
 * - Loading state management during auth operations
 * 
 * @param props - Component props containing children
 * @returns JSX element providing authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Authentication state management
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Transforms raw Supabase user object into normalized AuthUser format
   * 
   * This function handles the conversion from Supabase's user structure to our
   * application's standardized user format, providing fallbacks for missing data.
   * 
   * @param supabaseUser - Raw user object from Supabase Auth
   * @returns Normalized AuthUser object or null if no user data
   */
  const transformUser = (supabaseUser: any): AuthUser | null => {
    if (!supabaseUser) {
      console.log('[Auth] transformUser: No user data provided');
      return null;
    }

    // Extract and normalize user data
    const transformed = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      // Fallback to email username if no display name is set
      name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
      avatar: supabaseUser.user_metadata?.avatar_url,
    };
    console.log('transformUser: Transformed user:', transformed);
    return transformed;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setUser(transformUser(session?.user));
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      console.log('Auth state change:', event, session);
      setSession(session);
      setUser(transformUser(session?.user));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * User Registration Function
   * 
   * Creates a new user account using Supabase Auth with email verification.
   * Automatically stores the provided name in user metadata for future use.
   * 
   * @param email - Valid email address for the new account
   * @param password - Password (must meet Supabase requirements - min 6 chars)
   * @param name - Display name for the user profile
   * @returns Promise resolving to object with error property (null on success)
   * 
   * @example
   * ```tsx
   * const { error } = await signUp('user@example.com', 'securepassword', 'John Doe');
   * if (error) {
   *   console.error('Registration failed:', error.message);
   * }
   * ```
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[Auth] Starting user registration for:', email);
      setLoading(true);
      
      // Call Supabase Auth with user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // Store display name in user metadata
          },
        },
      });

      if (error) {
        console.error('[Auth] Registration error:', error.message);
        return { error };
      }

      console.log('[Auth] Registration successful for user:', data.user?.id);
      return { error: null };
    } catch (error: any) {
      console.error('[Auth] Registration exception:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * User Sign-In Function
   * 
   * Authenticates an existing user using email and password.
   * On successful authentication, the user state will be automatically
   * updated via the auth state change listener.
   * 
   * @param email - Registered user's email address
   * @param password - User's password
   * @returns Promise resolving to object with error property (null on success)
   * 
   * @example
   * ```tsx
   * const { error } = await signIn('user@example.com', 'password123');
   * if (error) {
   *   setErrorMessage(error.message);
   * } else {
   *   // User will be redirected automatically
   * }
   * ```
   */
  const signIn = async (email: string, password: string) => {
    try {
      console.log('[Auth] Starting sign-in process for:', email);
      setLoading(true);
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth] Sign-in error:', error.message);
        return { error };
      }

      console.log('[Auth] Sign-in successful for user:', data.user?.id);
      return { error: null };
    } catch (error: any) {
      console.error('[Auth] Sign-in exception:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * User Sign-Out Function
   * 
   * Signs out the current user and clears all authentication state.
   * This will trigger a redirect to the login page for protected routes.
   * 
   * @returns Promise that resolves when sign-out is complete
   * 
   * @example
   * ```tsx
   * const handleLogout = async () => {
   *   await signOut();
   *   router.push('/auth/login');
   * };
   * ```
   */
  const signOut = async () => {
    try {
      console.log('AuthContext: Starting signOut');
      setLoading(true);
      
      // First clear the state locally
      setUser(null);
      setSession(null);
      
      // Then call the mock supabase signOut (which will trigger auth state change)
      await supabase.auth.signOut();
      
      console.log('AuthContext: SignOut completed, user should be null');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
