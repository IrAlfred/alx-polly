'use client';

import { Poll, PollOption } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Share2, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollDetailsProps {
  poll: Poll;
  userVote?: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function PollDetails({ 
  poll, 
  userVote, 
  isOwner = false, 
  onEdit, 
  onDelete, 
  onShare 
}: PollDetailsProps) {
  const getVotePercentage = (option: PollOption) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((option.votes / poll.totalVotes) * 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-xl sm:text-2xl leading-tight">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="text-sm sm:text-base">{poll.description}</CardDescription>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare} className="flex-1 sm:flex-none">
                  <Share2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              )}
              {isOwner && onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 sm:flex-none">
                  <Edit className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              {isOwner && onDelete && (
                <Button variant="outline" size="sm" onClick={onDelete} className="flex-1 sm:flex-none">
                  <Trash2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} total votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(poll.createdAt)}</span>
            </div>
            {poll.expiresAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Expires {formatDate(poll.expiresAt)}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={poll.isActive ? 'default' : 'secondary'}>
              {poll.isActive ? 'Active' : 'Closed'}
            </Badge>
            {poll.allowMultipleChoices && (
              <Badge variant="outline">Multiple Choice</Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {poll.options
              .sort((a, b) => b.votes - a.votes)
              .map((option, index) => {
                const percentage = getVotePercentage(option);
                const isUserChoice = userVote === option.id;
                const isWinning = index === 0 && option.votes > 0;
                
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isWinning && poll.totalVotes > 0 && (
                          <Badge variant="default" className="text-xs">
                            Leading
                          </Badge>
                        )}
                        {isUserChoice && (
                          <Badge variant="secondary" className="text-xs">
                            Your Vote
                          </Badge>
                        )}
                        <span className="font-medium text-sm sm:text-base break-words">{option.text}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <span className="font-medium">{option.votes} votes</span>
                        <span className="text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div
                          className={cn(
                            "h-2 sm:h-3 rounded-full transition-all duration-500",
                            {
                              "bg-green-500": isUserChoice,
                              "bg-blue-500": isWinning && !isUserChoice,
                              "bg-gray-400": !isWinning && !isUserChoice,
                            }
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {poll.totalVotes === 0 && (
            <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
              No votes yet. Be the first to vote!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
