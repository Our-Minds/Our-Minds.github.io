import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'user' | 'consultant' | 'admin' | 'owner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  specialization?: string[];
  languages?: string[];
  location?: string;
  paypalEmail?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<UserProfile>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isConsultant: boolean;
  isOwner: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from auth user metadata
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      // First check if user exists in the database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected if the user is new
        throw error;
      }
      
      if (data) {
        // Map the database fields to our UserProfile interface
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          profileImage: data.profile_image
        };

        // If user is a consultant, fetch additional consultant data
        if (userProfile.role === 'consultant') {
          const { data: consultantData, error: consultantError } = await supabase
            .from('consultants')
            .select('*')
            .eq('id', userId)
            .single();

          if (consultantError && consultantError.code !== 'PGRST116') {
            throw consultantError;
          }

          if (consultantData) {
            userProfile.specialization = consultantData.specialization;
            userProfile.languages = consultantData.languages;
            userProfile.location = consultantData.location;
            userProfile.paypalEmail = consultantData.paypal_email;
            userProfile.bio = consultantData.bio;
          }
        }

        setProfile(userProfile);
        console.log("Profile fetched successfully:", userProfile);
      } else if (user?.user_metadata) {
        // New user, create profile from metadata
        const metadata = user.user_metadata;
        setProfile({
          id: user.id,
          email: user.email || '',
          name: metadata.name || user.email?.split('@')[0] || 'User',
          role: 'user', // Default role for new users
        });
        console.log("Created profile from metadata");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Profile Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    }
  };

  // Add the refreshProfile function
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // This function contains the initialization logic
    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state changed:", event, newSession?.user?.id);
            
            // Update the session state
            setSession(newSession);
            
            // Only update user if session state changed
            const newUser = newSession?.user ?? null;
            setUser(newUser);
            
            if (newUser) {
              // Use setTimeout to prevent potential auth deadlock
              setTimeout(() => {
                fetchProfile(newUser.id);
              }, 0);
            } else {
              setProfile(null);
            }
          }
        );

        // THEN check current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Current session:", currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
        
        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // Set session first, then user
      setSession(data.session);
      setUser(data.user);
      
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Failed to login, please try again",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Partial<UserProfile>, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting signup process with role:', userData.role);
      
      // Ensure role is properly set - no fallback to 'user' for consultants
      const userRole = userData.role || 'user';
      
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password: password,
        options: {
          data: {
            name: userData.name,
            role: userRole // Include role in metadata
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('User created in auth:', authData.user.id, 'with role:', userRole);

      // Wait a moment for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create the user profile data with the correct role
      const userEntry = {
        id: authData.user.id,
        email: userData.email!,
        name: userData.name!,
        role: userRole, // Use the actual role, not a fallback
        profile_image: userData.profileImage
      };
      
      console.log('Creating user profile:', userEntry);
      
      // Insert the user data in the users table
      const { error: userError } = await supabase
        .from('users')
        .insert([userEntry]);

      if (userError) {
        console.error('User profile creation error:', userError);
        throw new Error(`Failed to create user profile: ${userError.message}`);
      }

      console.log('User profile created successfully with role:', userRole);

      // If user is a consultant, create consultant profile
      if (userRole === 'consultant') {
        console.log('Creating consultant profile for user:', authData.user.id);
        
        const consultantEntry = {
          id: authData.user.id,
          specialization: userData.specialization || ['General Mental Health'],
          languages: userData.languages || ['English'],
          location: userData.location || 'Remote',
          bio: userData.bio || '',
          paypal_email: userData.paypalEmail || userData.email,
          approval_status: 'pending', // Consultants start as pending
          available: false, // Not available until approved
          hourly_rate: 50,
          rating: 0.0,
          review_count: 0
        };
        
        console.log('Inserting consultant data:', consultantEntry);
        
        const { error: consultantError } = await supabase
          .from('consultants')
          .insert([consultantEntry]);

        if (consultantError) {
          console.error('Consultant profile creation error:', consultantError);
          // If consultant creation fails, we should clean up the user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(`Failed to create consultant profile: ${consultantError.message}`);
        }
        
        console.log('Consultant profile created successfully with pending status');
      }

      // Fetch the complete profile
      await fetchProfile(authData.user.id);
      
      console.log('Signup completed successfully for role:', userRole);
      
    } catch (error: any) {
      console.error('Signup process error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error?.message || "Failed to logout, please try again",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Computed properties based on the user's role
  const isAuthenticated = !!session && !!user;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';
  const isConsultant = profile?.role === 'consultant';
  const isOwner = profile?.role === 'owner';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      error,
      login,
      signup,
      logout,
      isAuthenticated,
      isAdmin,
      isConsultant,
      isOwner,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
