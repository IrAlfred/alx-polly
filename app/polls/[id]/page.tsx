'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PollDetails } from '@/components/polls/poll-details';
import { useAuth } from '@/hooks/use-auth';
import { usePolls } from '@/hooks/use-polls';
import { useParams, useRouter } from 'next/navigation';

export default function PollDetailsPage() {
  const { user, logout } = useAuth();
  const { polls } = usePolls();
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;

  const handleLogin = () => {
    router.push('/');
  };

  const poll = polls.find(p => p.id === pollId);

  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} onLogin={handleLogin} onLogout={logout} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Poll Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The poll you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => router.push('/polls')}
              className="text-primary hover:underline"
            >
              Browse all polls
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit poll:', pollId);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    if (confirm('Are you sure you want to delete this poll?')) {
      console.log('Delete poll:', pollId);
      router.push('/dashboard');
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    const shareUrl = `${window.location.origin}/polls/${pollId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Poll URL copied to clipboard!');
  };

  const isOwner = user?.id === poll.createdBy;
  // Mock user vote for demo (in real app, this would come from API)
  const userVote = user ? poll.options[0].id : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PollDetails
            poll={poll}
            userVote={userVote}
            isOwner={isOwner}
            onEdit={isOwner ? handleEdit : undefined}
            onDelete={isOwner ? handleDelete : undefined}
            onShare={handleShare}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
