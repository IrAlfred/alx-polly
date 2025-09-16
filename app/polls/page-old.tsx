'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { pollService } from '@/lib/supabase-services';
import { Poll } from '@/types';
import { Search, Plus, Vote, Calendar, User } from 'lucide-react';

export default function PollsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, authLoading, router]);

  // Load polls from database
  useEffect(() => {
    const loadPolls = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('[PollsPage] Loading polls from database...');
        const pollsData = await pollService.getAllPolls();
        
        console.log('[PollsPage] Loaded polls:', pollsData.length);
        setPolls(pollsData || []);
      } catch (err: any) {
        console.error('[PollsPage] Error loading polls:', err);
        setError(err.message || 'Failed to load polls');
      } finally {
        setLoading(false);
      }
    };

    loadPolls();
  }, [user]);

  // Filter polls based on search term
  const filteredPolls = polls.filter(poll => 
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">All Polls</h1>
              <p className="text-muted-foreground">
                Discover and participate in community polls
              </p>
            </div>
            <Button onClick={() => router.push('/polls/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Poll
            </Button>
          </div>

          {/* Search Section */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading polls...</p>
              </div>
            </div>
          )}

          {/* Polls Grid */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPolls.length > 0 ? (
                filteredPolls.map((poll) => (
                  <Card key={poll.id} className="hover:shadow-lg transition-shadow cursor-pointer" 
                        onClick={() => router.push(`/polls/${poll.id}`)}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Vote className="w-5 h-5 text-blue-500" />
                        {poll.title}
                      </CardTitle>
                      {poll.description && (
                        <CardDescription>{poll.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {poll.options?.slice(0, 3).map((option, index) => (
                          <div key={option.id} className="flex items-center justify-between p-2 border rounded-lg">
                            <span className="text-sm">{option.text}</span>
                            <span className="text-xs text-gray-500">{option.votes} votes</span>
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500">Loading options...</p>
                        )}
                        
                        {poll.options && poll.options.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{poll.options.length - 3} more options
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>by {poll.created_by_profile?.name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No polls found' : 'No polls yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Be the first to create a poll for the community!'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => router.push('/polls/create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Poll
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <PollList 
            polls={filteredPolls}
            onVote={user ? vote : undefined}
            emptyMessage={
              searchTerm 
                ? `No polls found matching "${searchTerm}"`
                : "No polls available yet. Be the first to create one!"
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
