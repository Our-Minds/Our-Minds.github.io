
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { DashboardStats, ActivityData } from './types';

// Hook to fetch dashboard stats
export const useDashboardStats = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }
      
      try {
        // Get total users count
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Error fetching user count:', usersError);
          throw usersError;
        }

        // Get recent stories count (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: storiesCount, error: storiesError } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());

        if (storiesError) {
          console.error('Error fetching recent stories count:', storiesError);
          throw storiesError;
        }

        // Get pending consultant approvals count
        // In a real app, this would filter by a status field
        const { count: pendingCount, error: pendingError } = await supabase
          .from('consultants')
          .select('*', { count: 'exact', head: true })
          .eq('available', false);

        if (pendingError) {
          console.error('Error fetching pending approvals count:', pendingError);
          throw pendingError;
        }

        return {
          totalUsers: usersCount || 0,
          recentStories: storiesCount || 0,
          pendingApprovals: pendingCount || 0,
        } as DashboardStats;
      } catch (err) {
        console.error('Error in useDashboardStats:', err);
        throw err;
      }
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to fetch recent activities
export const useRecentActivities = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      try {
        // In a real app, there would be an activities table
        // This simulates recent activity from other tables

        // Get recent user sign ups
        const { data: recentUsers, error: usersError } = await supabase
          .from('users')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (usersError) {
          console.error('Error fetching recent users:', usersError);
          throw usersError;
        }

        // Get recent stories
        const { data: recentStories, error: storiesError } = await supabase
          .from('stories')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (storiesError) {
          console.error('Error fetching recent stories:', storiesError);
          throw storiesError;
        }

        // Get recent sessions
        const { data: recentSessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('id, user_id, consultant_id, start_time, created_at')
          .order('created_at', { ascending: false })
          .limit(2);

        if (sessionsError) {
          console.error('Error fetching recent sessions:', sessionsError);
          throw sessionsError;
        }

        // Combine and transform the data
        const activities: ActivityData[] = [
          ...(recentUsers || []).map((user: any) => ({
            id: `user-${user.id}`,
            type: 'user_joined' as const,
            text: `New user ${user.name || 'Anonymous'} joined the platform`,
            timestamp: user.created_at,
          })),
          ...(recentStories || []).map((story: any) => ({
            id: `story-${story.id}`,
            type: 'story_published' as const,
            text: `New story "${story.title || 'Untitled'}" was published`,
            timestamp: story.created_at,
          })),
          ...(recentSessions || []).map((session: any) => ({
            id: `session-${session.id}`,
            type: 'session_booked' as const,
            text: `New consultation session was booked`,
            timestamp: session.created_at,
          })),
        ];

        // Sort by timestamp
        activities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return activities.slice(0, 5);
      } catch (err) {
        console.error('Error in useRecentActivities:', err);
        throw err;
      }
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};
