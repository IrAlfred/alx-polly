'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PollList } from '@/components/polls/poll-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { usePolls } from '@/hooks/use-polls';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function PollsPage() {
  const { user } = useAuth();
  const { polls, vote } = usePolls();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPolls = polls.filter(poll => 
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">All Polls</h1>
              <p className="text-muted-foreground">
                Discover and participate in community polls
              </p>
            </div>
            <Button>
              Create New Poll
            </Button>
          </div>

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
