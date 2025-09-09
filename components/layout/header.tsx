'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/auth/user-profile';
import { AuthUser } from '@/types';
import { PlusCircle, BarChart3, Vote, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/polls', label: 'All Polls', icon: Vote },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/polls/create', label: 'Create Poll', icon: PlusCircle },
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
              <UserProfile user={user} onLogout={onLogout} />
            ) : (
              <Button onClick={onLogin}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
