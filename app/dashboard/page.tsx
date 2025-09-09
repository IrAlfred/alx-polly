'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { BarChart3, Vote, Users, Plus, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { polls, vote } = usePolls();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} onLogin={handleLogin} onLogout={logout} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to view your dashboard.
            </p>
            <button 
              onClick={handleLogin}
              className="text-primary hover:underline"
            >
              Sign in to continue
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock data - in a real app, this would be filtered by user
  const myPolls = polls.filter(poll => poll.createdBy === user.id);
  const totalVotes = myPolls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  const activePolls = myPolls.filter(poll => poll.isActive).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your polls and track performance
              </p>
            </div>
            <Button onClick={() => router.push('/polls/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myPolls.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activePolls} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVotes}</div>
                <p className="text-xs text-muted-foreground">
                  Across all polls
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Votes</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {myPolls.length > 0 ? Math.round(totalVotes / myPolls.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per poll
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12%</div>
                <p className="text-xs text-muted-foreground">
                  From last week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Polls</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {activePolls} Active
                </Badge>
                <Badge variant="secondary">
                  {myPolls.length - activePolls} Closed
                </Badge>
              </div>
            </div>

            <PollList
              polls={myPolls}
              onVote={vote}
              emptyMessage={
                <div className="text-center py-12">
                  <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first poll to get started
                  </p>
                  <Button onClick={() => router.push('/polls/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Poll
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
