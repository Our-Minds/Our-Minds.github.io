
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { UserData } from './types';

// Hook to fetch users
export const useUsers = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data as UserData[];
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to promote a user to admin
export const usePromoteUser = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return { userId, newRole };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'User role updated',
        description: `User has been promoted to ${data.newRole}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update user role',
        description: error.message || 'An error occurred while updating the user role.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to remove a user
export const useRemoveUser = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      // In a real app, this might be a soft delete or have additional cleanup
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return { userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'User removed',
        description: 'The user has been removed from the platform.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to remove user',
        description: error.message || 'An error occurred while removing the user.',
        variant: 'destructive',
      });
    },
  });
};
