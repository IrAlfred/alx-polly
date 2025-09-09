'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CreatePollForm } from '@/components/polls/create-poll-form';
import { useAuth } from '@/contexts/auth-context';
import { CreatePollData } from '@/types';

export default function CreatePollPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleCreatePoll = async (data: CreatePollData) => {
    try {
      setIsLoading(true);
      
      // TODO: Implement poll creation with Supabase
      console.log('Creating poll:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard after creation
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create poll:', error);
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

            <CreatePollForm onSubmit={handleCreatePoll} isLoading={isLoading} />
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
