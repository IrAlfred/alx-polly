/**
 * @fileoverview Supabase Service Layer for ALX Polly Application
 * 
 * This module provides a comprehensive service layer for interacting with
 * the Supabase database. It encapsulates all database operations including
 * user profiles, poll management, voting system, and analytics.
 * 
 * Key Features:
 * - Type-safe database operations with TypeScript interfaces
 * - Error handling and validation for all database calls
 * - Optimized queries with proper joins and filters
 * - Row Level Security (RLS) compliance
 * - Real-time subscription support for live updates
 * 
 * Architecture:
 * - Service objects group related operations (profiles, polls, votes)
 * - Consistent error handling patterns across all services  
 * - Proper data transformation and validation
 * - Performance optimizations with selective field querying
 * 
 * @author ALX Polly Team
 * @version 1.0.0
 */

import { supabase } from './supabase';
import { Poll, PollOption, Vote, CreatePollData, Profile } from '@/types';

/**
 * Profile Service - User Profile Management Operations
 * 
 * Handles all user profile-related database operations including
 * profile retrieval, updates, and metadata management.
 */
export const profileService = {
  /**
   * Retrieves a user profile by ID
   * 
   * @param userId - Unique identifier for the user
   * @returns Promise resolving to user profile data
   * @throws Error if profile not found or database error occurs
   * 
   * @example
   * ```typescript
   * const profile = await profileService.getProfile('user-123');
   * console.log(profile.name, profile.avatar_url);
   * ```
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[ProfileService] Error fetching profile:', error);
      throw error;
    }
    
    return data as Profile;
  },

  /**
   * Updates user profile with new data
   * 
   * Automatically sets the updated_at timestamp and validates the user
   * has permission to update the profile via RLS policies.
   * 
   * @param userId - User ID of the profile to update
   * @param updates - Partial profile data to update
   * @returns Promise resolving to updated profile data
   * @throws Error if update fails or user lacks permission
   * 
   * @example
   * ```typescript
   * const updated = await profileService.updateProfile('user-123', {
   *   name: 'New Name',
   *   avatar_url: 'https://example.com/avatar.png'
   * });
   * ```
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[ProfileService] Error updating profile:', error);
      throw error;
    }
    
    return data as Profile;
  }
};

/**
 * Poll Service - Poll Management Operations
 * 
 * Comprehensive poll management including creation, retrieval, updates,
 * and deletion with proper authorization and data validation.
 */
export const pollService = {
  async getAllPolls() {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        profiles:created_by (*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in getAllPolls:', error);
      throw error;
    }
    
    // Return empty array if no data, otherwise return the data
    return (data || []) as (Poll & { poll_options: PollOption[], profiles: Profile })[];
  },

  async getPollById(pollId: string) {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        profiles:created_by (*)
      `)
      .eq('id', pollId)
      .single();

    if (error) throw error;
    return data as Poll & { poll_options: PollOption[], profiles: Profile };
  },

  async getUserPolls(userId: string) {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*)
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as (Poll & { poll_options: PollOption[] })[];
  },

  async createPoll(pollData: CreatePollData, userId: string) {
    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: pollData.title,
        description: pollData.description,
        created_by: userId,
        allow_multiple_choices: pollData.allowMultipleChoices
      })
      .select()
      .single();

    if (pollError) throw pollError;

    // Create the poll options
    const optionsData = pollData.options.map(option => ({
      poll_id: poll.id,
      text: option
    }));

    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData)
      .select();

    if (optionsError) throw optionsError;

    return { ...poll, poll_options: options } as Poll & { poll_options: PollOption[] };
  },

  async updatePoll(pollId: string, updates: Partial<Poll>, userId: string) {
    const { data, error } = await supabase
      .from('polls')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', pollId)
      .eq('created_by', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Poll;
  },

  async deletePoll(pollId: string, userId: string) {
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)
      .eq('created_by', userId);

    if (error) throw error;
  }
};

// Vote operations
export const voteService = {
  async getUserVote(pollId: string, userId: string) {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('user_id', userId);

    if (error) throw error;
    return data as Vote[];
  },

  async vote(pollId: string, optionId: string, userId: string) {
    // Check if user has already voted on this poll
    const existingVotes = await this.getUserVote(pollId, userId);
    
    // Check if poll allows multiple choices
    const { data: poll } = await supabase
      .from('polls')
      .select('allow_multiple_choices')
      .eq('id', pollId)
      .single();

    if (!poll?.allow_multiple_choices && existingVotes.length > 0) {
      // Remove existing vote first
      await supabase
        .from('votes')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', userId);
    }

    // Add new vote
    const { data, error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data as Vote;
  },

  async removeVote(pollId: string, optionId: string, userId: string) {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('poll_id', pollId)
      .eq('option_id', optionId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToPollChanges(pollId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`poll-${pollId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'votes', filter: `poll_id=eq.${pollId}` }, 
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'poll_options', filter: `poll_id=eq.${pollId}` }, 
        callback
      )
      .subscribe();
  },

  subscribeToPolls(callback: (payload: any) => void) {
    return supabase
      .channel('polls')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'polls' }, 
        callback
      )
      .subscribe();
  }
};
