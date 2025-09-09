'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { PollList } from '@/components/polls/poll-list';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { usePolls } from '@/hooks/use-polls';
import { Vote, Users, BarChart3, Plus } from 'lucide-react';

export default function HomePage() {
  const { user, login, register, logout } = useAuth();
  const { polls, vote } = usePolls();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setIsLoginOpen(true);
    setShowRegister(false);
  };

  const handleAuthSuccess = () => {
    setIsLoginOpen(false);
    setShowRegister(false);
  };

  const recentPolls = polls.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {user ? (
          // Logged in view
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-xl text-muted-foreground">
                What would you like to poll about today?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border">
                <Vote className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Create Poll</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new poll and get instant feedback
                </p>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Poll
                </Button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border">
                <Users className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Browse Polls</h3>
                <p className="text-muted-foreground mb-4">
                  Discover and vote on community polls
                </p>
                <Button variant="outline" className="w-full">
                  View All Polls
                </Button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border">
                <BarChart3 className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Track your polls and analyze results
                </p>
                <Button variant="outline" className="w-full">
                  View Dashboard
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Polls</h2>
              <PollList 
                polls={recentPolls} 
                onVote={vote}
                emptyMessage="No polls yet. Create your first poll!"
              />
            </div>
          </div>
        ) : (
          // Landing page for non-authenticated users
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold">
                Create and Share Polls with{' '}
                <span className="text-primary">Polly</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Make decisions together. Create polls, gather opinions, and see results in real-time.
              </p>
              <div className="flex justify-center space-x-4">
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8">
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    {showRegister ? (
                      <div className="space-y-4">
                        <RegisterForm 
                          onRegister={async (data) => {
                            await register(data);
                            handleAuthSuccess();
                          }}
                        />
                        <div className="text-center">
                          <Button 
                            variant="ghost" 
                            onClick={() => setShowRegister(false)}
                          >
                            Already have an account? Sign in
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <LoginForm 
                          onLogin={async (credentials) => {
                            await login(credentials);
                            handleAuthSuccess();
                          }}
                        />
                        <div className="text-center">
                          <Button 
                            variant="ghost" 
                            onClick={() => setShowRegister(true)}
                          >
                            Don't have an account? Sign up
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Vote className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Easy to Create</h3>
                <p className="text-muted-foreground">
                  Create polls in seconds with our intuitive interface
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Results</h3>
                <p className="text-muted-foreground">
                  See votes come in live and watch results update instantly
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Powerful Analytics</h3>
                <p className="text-muted-foreground">
                  Get detailed insights and analytics on your poll results
                </p>
              </div>
            </div>

            {recentPolls.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Featured Polls</h2>
                <PollList 
                  polls={recentPolls} 
                  emptyMessage=""
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
