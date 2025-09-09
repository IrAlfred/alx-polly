'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CreatePollForm } from '@/components/polls/create-poll-form';
import { useAuth } from '@/hooks/use-auth';
import { usePolls } from '@/hooks/use-polls';
import { useRouter } from 'next/navigation';

export default function CreatePollPage() {
  const { user, logout } = useAuth();
  const { createPoll } = usePolls();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/');
  };

  const handleCreatePoll = async (data: any) => {
    try {
      const newPoll = await createPoll(data);
      router.push(`/polls/${newPoll.id}`);
    } catch (error) {
      console.error('Failed to create poll:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} onLogin={handleLogin} onLogout={logout} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to create a poll.
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Poll</h1>
            <p className="text-muted-foreground">
              Ask a question and get instant feedback from the community
            </p>
          </div>
          
          <CreatePollForm onSubmit={handleCreatePoll} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
