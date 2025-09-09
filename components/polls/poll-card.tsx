'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Poll, PollOption } from '@/types';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  userVote?: string; // optionId that user has voted for
  isLoading?: boolean;
  showResults?: boolean;
}

export function PollCard({ 
  poll, 
  onVote, 
  userVote, 
  isLoading = false, 
  showResults = false 
}: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleVote = () => {
    if (selectedOption && onVote) {
      onVote(poll.id, selectedOption);
    }
  };

  const getVotePercentage = (option: PollOption) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((option.votes / poll.totalVotes) * 100);
  };

  const hasVoted = !!userVote;
  const canVote = poll.isActive && !hasVoted && onVote;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="mt-2">{poll.description}</CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={poll.isActive ? 'default' : 'secondary'}>
              {poll.isActive ? 'Active' : 'Closed'}
            </Badge>
            {poll.allowMultipleChoices && (
              <Badge variant="outline">Multiple Choice</Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = getVotePercentage(option);
            const isSelected = selectedOption === option.id;
            const isUserChoice = userVote === option.id;
            
            return (
              <div
                key={option.id}
                className={cn(
                  "relative p-3 rounded-lg border cursor-pointer transition-colors",
                  {
                    "border-primary bg-primary/5": isSelected && canVote,
                    "border-green-500 bg-green-50": isUserChoice,
                    "hover:border-primary/50": canVote && !isSelected,
                    "cursor-default": !canVote,
                  }
                )}
                onClick={() => canVote && setSelectedOption(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isUserChoice && <CheckCircle className="h-4 w-4 text-green-600" />}
                    <span className="font-medium">{option.text}</span>
                  </div>
                  {(showResults || hasVoted) && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{option.votes}</span>
                      <span className="text-sm text-muted-foreground">({percentage}%)</span>
                    </div>
                  )}
                </div>
                
                {(showResults || hasVoted) && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          isUserChoice ? "bg-green-500" : "bg-primary"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {canVote && (
          <div className="mt-6">
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption || isLoading}
              className="w-full"
            >
              {isLoading ? 'Submitting Vote...' : 'Submit Vote'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
