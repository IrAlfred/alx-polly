/**
 * @fileoverview Responsive Header Component for ALX Polly Application
 * 
 * Features:
 * - Mobile-responsive navigation with hamburger menu
 * - Active state indicators for navigation items
 * - User authentication state handling
 * - Sticky header with backdrop blur effect
 * 
 * @author ALX Polly Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/auth/user-profile';
import { useAuth } from '@/contexts/auth-context';
import { PlusCircle, BarChart3, Vote, Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      await signOut();
      console.log('SignOut completed');
      // Force hard navigation to home to avoid any caching issues
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/polls', label: 'All Polls', icon: Vote },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, requireAuth: true },
    { href: '/polls/create', label: 'Create Poll', icon: PlusCircle, requireAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.requireAuth || user);

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
              Polly
            </Link>
          </div>
            
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-lg",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserProfile 
                user={{
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  avatar: user.avatar,
                }} 
                onLogout={handleLogout} 
              />
            ) : (
              <Button onClick={handleLogin} size="sm">Sign In</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <UserProfile 
                user={{
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  avatar: user.avatar,
                }} 
                onLogout={handleLogout} 
              />
            ) : (
              <Button onClick={handleLogin} size="sm" className="text-xs">Sign In</Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors rounded-lg mx-2",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
