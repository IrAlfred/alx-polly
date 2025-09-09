'use client';

import { useState, useEffect } from 'react';
import { Poll, CreatePollData } from '@/types';
import { pollService, voteService, subscriptions } from '@/lib/supabase-services';
import { useAuth } from '@/contexts/auth-context';

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPolls();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToPolls((payload) => {
      console.log('Poll change detected:', payload);
      loadPolls(); // Reload polls when changes occur
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPolls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await pollService.getAllPolls();
      
      // Transform data to match our component expectations
      const transformedPolls: Poll[] = data.map(poll => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        created_by: poll.created_by,
        created_at: poll.created_at,
        updated_at: poll.updated_at,
        is_active: poll.is_active,
        allow_multiple_choices: poll.allow_multiple_choices,
        total_votes: poll.total_votes,
        options: poll.poll_options.map(option => ({
          id: option.id,
          poll_id: option.poll_id,
          text: option.text,
          votes: option.votes,
          created_at: option.created_at
        })),
        created_by_profile: poll.profiles
      }));

      setPolls(transformedPolls);
    } catch (err: any) {
      console.error('Error loading polls:', err);
      setError(err.message || 'Failed to load polls');
    } finally {
      setIsLoading(false);
    }
  };

  const createPoll = async (pollData: CreatePollData) => {
    if (!user) {
      throw new Error('You must be logged in to create a poll');
    }

    try {
      setError(null);
      const newPoll = await pollService.createPoll(pollData, user.id);
      
      // Reload polls to get the latest data
      await loadPolls();
      
      return newPoll;
    } catch (err: any) {
      console.error('Error creating poll:', err);
      setError(err.message || 'Failed to create poll');
      throw err;
    }
  };

  const vote = async (pollId: string, optionId: string) => {
    if (!user) {
      throw new Error('You must be logged in to vote');
    }

    try {
      setError(null);
      await voteService.vote(pollId, optionId, user.id);
      
      // Reload polls to get updated vote counts
      await loadPolls();
    } catch (err: any) {
      console.error('Error voting:', err);
      setError(err.message || 'Failed to vote');
      throw err;
    }
  };

  const getUserVotes = async (pollId: string) => {
    if (!user) return [];

    try {
      return await voteService.getUserVote(pollId, user.id);
    } catch (err: any) {
      console.error('Error getting user votes:', err);
      return [];
    }
  };

  return {
    polls,
    isLoading,
    error,
    createPoll,
    vote,
    getUserVotes,
    refetch: loadPolls
  };
}
