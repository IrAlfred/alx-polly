'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CreatePollForm } from '@/components/polls/create-poll-form';
import { useAuth } from '@/contexts/auth-context';
import { CreatePollData } from '@/types';
import { pollService } from '@/lib/supabase-services';

export default function CreatePollPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleCreatePoll = async (data: CreatePollData) => {
    if (!user) {
      setError('You must be logged in to create a poll');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[CreatePoll] Creating poll with data:', {
        title: data.title,
        optionCount: data.options.length,
        allowMultiple: data.allowMultipleChoices
      });
      
      // Create the poll using the pollService
      const newPoll = await pollService.createPoll(data, user.id);
      
      console.log('[CreatePoll] Poll created successfully:', newPoll.id);
      
      // Redirect to polls page after successful creation
      router.push('/polls');
    } catch (error: any) {
      console.error('[CreatePoll] Failed to create poll:', error);
      setError(error.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Poll
              </h1>
              <p className="text-gray-600 mt-2">
                Ask a question and let others vote on the options
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <CreatePollForm onSubmit={handleCreatePoll} isLoading={isLoading} />
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
