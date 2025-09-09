'use client';

import { Poll } from '@/types';
import { PollCard } from './poll-card';

interface PollListProps {
  polls: Poll[];
  onVote?: (pollId: string, optionId: string) => void;
  userVotes?: Record<string, string>; // pollId -> optionId
  isLoading?: boolean;
  emptyMessage?: string | React.ReactNode;
}

export function PollList({ 
  polls, 
  onVote, 
  userVotes = {}, 
  isLoading = false,
  emptyMessage = "No polls available"
}: PollListProps) {
  if (polls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onVote={onVote}
          userVote={userVotes[poll.id]}
          isLoading={isLoading}
          showResults={!!userVotes[poll.id]}
        />
      ))}
    </div>
  );
}
