// Database Types (matching Supabase structure)
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  allow_multiple_choices: boolean;
  total_votes: number;
  // Joined data
  options?: PollOption[];
  created_by_profile?: Profile;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

// Legacy types for compatibility (will be phased out)
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
