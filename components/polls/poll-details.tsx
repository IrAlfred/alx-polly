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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="text-base">{poll.description}</CardDescription>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {isOwner && onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {isOwner && onDelete && (
                <Button variant="outline" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          
          <div className="flex items-center space-x-2">
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
        <CardHeader>
          <CardTitle className="text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {poll.options
              .sort((a, b) => b.votes - a.votes)
              .map((option, index) => {
                const percentage = getVotePercentage(option);
                const isUserChoice = userVote === option.id;
                const isWinning = index === 0 && option.votes > 0;
                
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
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
                        <span className="font-medium">{option.text}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">{option.votes} votes</span>
                        <span className="text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={cn(
                            "h-3 rounded-full transition-all duration-500",
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
            <div className="text-center py-8 text-muted-foreground">
              No votes yet. Be the first to vote!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
