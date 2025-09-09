'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/auth/user-profile';
import { useAuth } from '@/contexts/auth-context';
import { PlusCircle, BarChart3, Vote, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

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

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Polly
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                // Skip auth-required items if user is not logged in
                if (item.requireAuth && !user) return null;
                
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
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
              <Button onClick={handleLogin}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
