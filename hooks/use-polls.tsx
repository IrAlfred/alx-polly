'use client';

import { useState, useEffect } from 'react';
import { Poll, CreatePollData } from '@/types';

// Mock data for development
const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'What should we have for lunch?',
    description: 'Weekly team lunch poll',
    options: [
      { id: '1a', text: 'Pizza', votes: 5, pollId: '1' },
      { id: '1b', text: 'Sushi', votes: 3, pollId: '1' },
      { id: '1c', text: 'Burgers', votes: 7, pollId: '1' },
    ],
    createdBy: '1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    isActive: true,
    allowMultipleChoices: false,
    totalVotes: 15,
  },
  {
    id: '2',
    title: 'Best programming language for 2025?',
    description: 'Let\'s settle this debate once and for all',
    options: [
      { id: '2a', text: 'TypeScript', votes: 12, pollId: '2' },
      { id: '2b', text: 'Python', votes: 8, pollId: '2' },
      { id: '2c', text: 'Rust', votes: 6, pollId: '2' },
      { id: '2d', text: 'Go', votes: 4, pollId: '2' },
    ],
    createdBy: '1',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
    isActive: true,
    allowMultipleChoices: false,
    totalVotes: 30,
  },
];

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadPolls = async () => {
      setIsLoading(true);
      // Add some delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      setPolls(mockPolls);
      setIsLoading(false);
    };

    loadPolls();
  }, []);

  const createPoll = async (data: CreatePollData): Promise<Poll> => {
    const newPoll: Poll = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      options: data.options.map((text, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
        votes: 0,
        pollId: '',
      })),
      createdBy: '1', // TODO: Get from auth context
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: data.expiresAt,
      isActive: true,
      allowMultipleChoices: data.allowMultipleChoices,
      totalVotes: 0,
    };

    // Update poll options with the correct pollId
    newPoll.options = newPoll.options.map(option => ({
      ...option,
      pollId: newPoll.id,
    }));

    setPolls(prev => [newPoll, ...prev]);
    return newPoll;
  };

  const vote = async (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
          totalVotes: poll.totalVotes + 1,
        };
      }
      return poll;
    }));
  };

  const getPollById = (id: string): Poll | undefined => {
    return polls.find(poll => poll.id === id);
  };

  return {
    polls,
    isLoading,
    createPoll,
    vote,
    getPollById,
  };
}
