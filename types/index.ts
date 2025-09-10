/**
 * @fileoverview TypeScript Type Definitions for ALX Polly Application
 * 
 * This module contains comprehensive type definitions for the entire application,
 * ensuring type safety across all components, services, and data operations.
 * 
 * Type Categories:
 * - Database Models: Direct mappings to Supabase table structures
 * - Form Data Types: Input validation and form handling
 * - API Response Types: Network request/response interfaces
 * - UI Component Types: Props and state management interfaces
 * 
 * All types follow TypeScript strict mode requirements and include
 * comprehensive documentation for maintainability.
 * 
 * @author ALX Polly Team
 * @version 1.0.0
 */

// ============================================================================
// DATABASE MODELS - Direct Supabase Table Mappings
// ============================================================================

/**
 * User Profile Database Model
 * 
 * Represents the profiles table in Supabase, containing user account
 * information and metadata. Linked to Supabase Auth users via RLS.
 */
export interface Profile {
  /** Primary key - matches Supabase Auth user ID */
  id: string;
  /** User's email address from authentication */
  email: string;
  /** Display name for the user */
  name: string;
  /** Optional avatar image URL */
  avatar_url?: string;
  /** Account creation timestamp */
  created_at: string;
  /** Last profile update timestamp */
  updated_at: string;
}

/**
 * Poll Database Model
 * 
 * Represents the polls table with all poll metadata, settings, and
 * aggregated statistics. Includes optional joined data for efficiency.
 */
export interface Poll {
  /** Unique poll identifier */
  id: string;
  /** Poll title/question */
  title: string;
  /** Optional detailed description */
  description?: string;
  /** Foreign key to creator's profile */
  created_by: string;
  /** Poll creation timestamp */
  created_at: string;
  /** Last modification timestamp */
  updated_at: string;
  /** Whether poll accepts new votes */
  is_active: boolean;
  /** Whether users can select multiple options */
  allow_multiple_choices: boolean;
  /** Cached total vote count for performance */
  total_votes: number;
  
  // Joined data (populated by service layer when needed)
  /** Poll options with vote counts */
  options?: PollOption[];
  /** Creator profile information */
  created_by_profile?: Profile;
}

/**
 * Poll Option Database Model
 * 
 * Represents individual choices within a poll, with cached vote counts
 * for performance optimization.
 */
export interface PollOption {
  /** Unique option identifier */
  id: string;
  /** Foreign key to parent poll */
  poll_id: string;
  /** Option text/description */
  text: string;
  /** Cached vote count for this option */
  votes: number;
  /** Option creation timestamp */
  created_at: string;
}

/**
 * Vote Database Model
 * 
 * Represents individual user votes on poll options. Used for
 * analytics, preventing duplicate votes, and audit trails.
 */
export interface Vote {
  /** Unique vote identifier */
  id: string;
  /** Foreign key to poll */
  poll_id: string;
  /** Foreign key to selected option */
  option_id: string;
  /** Foreign key to voting user */
  user_id: string;
  /** Vote timestamp */
  created_at: string;
}

// ============================================================================
// LEGACY TYPES - Maintained for Compatibility
// ============================================================================

/**
 * @deprecated Legacy User type - use Profile instead
 * 
 * This type is maintained for backward compatibility during the migration
 * to the new database schema. Will be removed in v2.0.0.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePollData {
  title: string;
  description?: string;
  options: string[];
  expiresAt?: Date;
  allowMultipleChoices: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
