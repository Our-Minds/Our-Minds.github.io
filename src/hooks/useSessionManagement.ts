import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isAfter, isBefore } from 'date-fns';

interface SessionWithUser {
  id: string;
  user_id: string;
  consultant_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_payment_confirmation';
  notes: string | null;
  created_at: string;
  user: {
    name: string;
    profile_image: string | null;
  } | null;
}

export function useSessionManagement() {
  const { user, isConsultant } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionWithUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSessions = async () => {
    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching sessions for user:', user.id, 'isConsultant:', isConsultant);
      
      // First, get sessions based on user role
      let sessionsQuery;
      
      if (isConsultant) {
        // For consultants, get sessions where they are the consultant
        sessionsQuery = supabase
          .from('sessions')
          .select('*')
          .eq('consultant_id', user.id)
          .order('start_time', { ascending: false });
      } else {
        // For regular users, get sessions where they are the user
        sessionsQuery = supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false });
      }
      
      console.log('Executing sessions query...');
      const { data: sessionsData, error: sessionsError } = await sessionsQuery;
      
      if (sessionsError) {
        console.error('Sessions query error:', sessionsError);
        throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);
      }

      console.log('Raw session data:', sessionsData);

      if (!sessionsData || sessionsData.length === 0) {
        console.log('No sessions found');
        setSessions([]);
        return;
      }

      // Now fetch user data for each session manually
      const userIds = new Set<string>();
      sessionsData.forEach(session => {
        if (isConsultant) {
          // For consultants, we want to see client (user) info
          userIds.add(session.user_id);
        } else {
          // For users, we want to see consultant info
          userIds.add(session.consultant_id);
        }
      });

      console.log('Fetching user data for IDs:', Array.from(userIds));
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, profile_image')
        .in('id', Array.from(userIds));

      if (usersError) {
        console.error('Users query error:', usersError);
        throw new Error(`Failed to fetch user data: ${usersError.message}`);
      }

      console.log('Users data:', usersData);

      // Transform the data to match our interface
      const transformedSessions: SessionWithUser[] = sessionsData.map((session: any) => {
        console.log('Transforming session:', session);
        
        // Determine which user info to attach based on role
        const targetUserId = isConsultant ? session.user_id : session.consultant_id;
        const userData = usersData?.find(u => u.id === targetUserId);
        
        return {
          id: session.id,
          user_id: session.user_id,
          consultant_id: session.consultant_id,
          start_time: session.start_time,
          end_time: session.end_time,
          status: session.status as 'scheduled' | 'completed' | 'cancelled' | 'pending_payment_confirmation',
          notes: session.notes,
          created_at: session.created_at,
          user: userData ? {
            name: userData.name || 'Unknown User',
            profile_image: userData.profile_image || null
          } : null
        };
      });
      
      console.log('Transformed sessions:', transformedSessions);
      setSessions(transformedSessions);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      const errorMessage = err.message || 'Could not load your sessions.';
      setError(errorMessage);
      toast({
        title: "Error fetching sessions",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateSessionStatus = async (sessionId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    if (!user || !isConsultant) {
      toast({
        title: "Unauthorized",
        description: "Only consultants can update session status.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating session status:', sessionId, newStatus);
      
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', sessionId)
        .eq('consultant_id', user.id);
      
      if (error) {
        console.error('Error updating session:', error);
        throw new Error(`Failed to update session: ${error.message}`);
      }
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, status: newStatus } : session
      ));
      
      toast({
        title: "Session updated",
        description: `The session has been marked as ${newStatus}.`
      });
    } catch (err: any) {
      console.error('Update session error:', err);
      toast({
        title: "Error updating session",
        description: err.message || "Could not update the session status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter sessions by status
  const upcomingSessions = sessions.filter(session => 
    (session.status === 'scheduled' || session.status === 'pending_payment_confirmation') && 
    isAfter(parseISO(session.start_time), new Date())
  );
  
  const pastSessions = sessions.filter(session => 
    session.status === 'completed' || 
    (session.status !== 'cancelled' && isBefore(parseISO(session.start_time), new Date()))
  );
  
  const cancelledSessions = sessions.filter(session => 
    session.status === 'cancelled'
  );
  
  const formatSessionDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };
  
  const formatSessionTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a');
    } catch (err) {
      console.error('Error formatting time:', err);
      return 'Invalid time';
    }
  };
  
  const getSessionDuration = (start: string, end: string) => {
    try {
      const startDate = parseISO(start);
      const endDate = parseISO(end);
      const diffMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
      return `${diffMinutes} min`;
    } catch (err) {
      console.error('Error calculating duration:', err);
      return 'Unknown duration';
    }
  };

  return {
    sessions,
    isLoading,
    error,
    upcomingSessions,
    pastSessions,
    cancelledSessions,
    fetchSessions,
    updateSessionStatus,
    formatSessionDate,
    formatSessionTime,
    getSessionDuration
  };
}
