
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  fitness_goals: string | null;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get the current user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          setUserProfile(null);
          setIsLoading(false);
          return;
        }

        // Fetch the user's profile data
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setUserProfile(data as UserProfile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile();
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    fetchProfile();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...profile } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, isLoading, error, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
