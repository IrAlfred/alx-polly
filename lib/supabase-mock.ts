// Simple implementation that works without @supabase/supabase-js package
// This allows the app to run while we troubleshoot the package installation

interface SupabaseAuthResponse {
  data: any;
  error: any;
}

interface SupabaseClient {
  auth: {
    getSession(): Promise<{ data: { session: any }, error: any }>;
    signUp(params: { email: string, password: string, options?: any }): Promise<SupabaseAuthResponse>;
    signInWithPassword(params: { email: string, password: string }): Promise<SupabaseAuthResponse>;
    signOut(): Promise<{ error: any }>;
    onAuthStateChange(callback: (event: any, session: any) => void): { data: { subscription: { unsubscribe: () => void } } };
    resetPasswordForEmail(email: string, options?: any): Promise<SupabaseAuthResponse>;
  };
}

// Mock implementation that mimics Supabase behavior
export const supabase: SupabaseClient = {
  auth: {
    getSession: async () => {
      // Check localStorage for existing session (basic implementation)
      const sessionData = localStorage?.getItem('supabase-session');
      const session = sessionData ? JSON.parse(sessionData) : null;
      return { data: { session }, error: null };
    },

    signUp: async ({ email, password, options }) => {
      console.log('Mock signUp:', { email, options });
      // In a real implementation, this would call Supabase API
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        email,
        user_metadata: options?.data || {}
      };
      
      // Store in localStorage for demo purposes
      localStorage?.setItem('supabase-session', JSON.stringify({
        user: mockUser,
        access_token: 'mock-token-' + Date.now()
      }));

      return {
        data: { user: mockUser },
        error: null
      };
    },

    signInWithPassword: async ({ email, password }) => {
      console.log('Mock signIn:', { email });
      // Mock successful login
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        email,
        user_metadata: { name: email.split('@')[0] }
      };

      const session = {
        user: mockUser,
        access_token: 'mock-token-' + Date.now()
      };

      localStorage?.setItem('supabase-session', JSON.stringify(session));

      return {
        data: { user: mockUser, session },
        error: null
      };
    },

    signOut: async () => {
      localStorage?.removeItem('supabase-session');
      return { error: null };
    },

    onAuthStateChange: (callback) => {
      // Simple implementation - call callback with current session
      const sessionData = localStorage?.getItem('supabase-session');
      const session = sessionData ? JSON.parse(sessionData) : null;
      setTimeout(() => callback('SIGNED_IN', session), 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Unsubscribed from auth changes')
          }
        }
      };
    },

    resetPasswordForEmail: async (email, options) => {
      console.log('Mock resetPasswordForEmail:', email);
      return { data: null, error: null };
    }
  }
};

// Auth helper functions
export const authService = {
  signUp: async (email: string, password: string, name: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { user: session?.user || null, error: null };
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },

  updatePassword: async (newPassword: string) => {
    console.log('Mock updatePassword');
    return { data: null, error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
