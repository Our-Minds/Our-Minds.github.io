
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { ConsultantApplicationData } from './types';

// Hook to fetch all consultants (not just pending)
export const useAllConsultants = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['all-consultants'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('Fetching all consultants...');

      try {
        // Get all consultants regardless of approval status
        const { data: consultants, error: consultantsError } = await supabase
          .from('consultants')
          .select(`
            id, 
            specialization, 
            created_at,
            approval_status,
            available
          `)
          .order('created_at', { ascending: false });

        if (consultantsError) {
          console.error('Error fetching consultants:', consultantsError);
          throw consultantsError;
        }

        console.log('Found all consultants:', consultants);

        if (!consultants || consultants.length === 0) {
          console.log('No consultants found');
          return [];
        }

        // Get user data for each consultant
        const userIds = consultants.map(c => c.id);
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, email')
          .in('id', userIds);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }

        console.log('Found users for consultants:', users);

        // Combine consultant and user data
        const applications: (ConsultantApplicationData & { status: string })[] = consultants.map(consultant => {
          const user = users?.find(u => u.id === consultant.id);
          return {
            id: consultant.id,
            name: user?.name || 'Unknown',
            email: user?.email || 'no-email@example.com',
            specialization: consultant.specialization || [],
            submittedDate: format(new Date(consultant.created_at), 'yyyy-MM-dd'),
            status: consultant.approval_status
          };
        });

        console.log('Final all consultants data:', applications);
        return applications;
      } catch (err) {
        console.error('Error in useAllConsultants:', err);
        throw err;
      }
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to fetch pending consultant applications
export const usePendingConsultants = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['pending-consultants'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('Fetching pending consultants...');

      try {
        // Get consultants with pending approval status
        const { data: consultants, error: consultantsError } = await supabase
          .from('consultants')
          .select(`
            id, 
            specialization, 
            created_at,
            approval_status
          `)
          .eq('approval_status', 'pending')
          .order('created_at', { ascending: false });

        if (consultantsError) {
          console.error('Error fetching consultants:', consultantsError);
          throw consultantsError;
        }

        console.log('Found pending consultants:', consultants);

        if (!consultants || consultants.length === 0) {
          console.log('No pending consultants found');
          return [];
        }

        // Get user data for each consultant
        const userIds = consultants.map(c => c.id);
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, email')
          .in('id', userIds);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }

        console.log('Found users for pending consultants:', users);

        // Combine consultant and user data
        const applications: ConsultantApplicationData[] = consultants.map(consultant => {
          const user = users?.find(u => u.id === consultant.id);
          return {
            id: consultant.id,
            name: user?.name || 'Unknown',
            email: user?.email || 'no-email@example.com',
            specialization: consultant.specialization || [],
            submittedDate: format(new Date(consultant.created_at), 'yyyy-MM-dd'),
          };
        });

        console.log('Final pending applications data:', applications);
        return applications;
      } catch (err) {
        console.error('Error in usePendingConsultants:', err);
        throw err;
      }
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to approve a consultant
export const useApproveConsultant = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async (consultantId: string) => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('Approving consultant:', consultantId);

      const { error } = await supabase
        .from('consultants')
        .update({ 
          approval_status: 'approved',
          available: true 
        })
        .eq('id', consultantId);

      if (error) {
        console.error('Error approving consultant:', error);
        throw error;
      }

      return { consultantId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-consultants'] });
      queryClient.invalidateQueries({ queryKey: ['all-consultants'] });
      queryClient.invalidateQueries({ queryKey: ['approved-consultants'] });
      toast({
        title: 'Consultant approved',
        description: 'The consultant has been approved and is now available for sessions.',
      });
    },
    onError: (error) => {
      console.error('Failed to approve consultant:', error);
      toast({
        title: 'Failed to approve consultant',
        description: error.message || 'An error occurred while approving the consultant.',
        variant: 'destructive',
      });
    },
  });
};

// Hook to reject a consultant
export const useRejectConsultant = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async (consultantId: string) => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('Rejecting consultant:', consultantId);

      const { error } = await supabase
        .from('consultants')
        .update({ 
          approval_status: 'rejected',
          available: false 
        })
        .eq('id', consultantId);

      if (error) {
        console.error('Error rejecting consultant:', error);
        throw error;
      }

      return { consultantId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-consultants'] });
      queryClient.invalidateQueries({ queryKey: ['all-consultants'] });
      queryClient.invalidateQueries({ queryKey: ['approved-consultants'] });
      toast({
        title: 'Consultant rejected',
        description: 'The consultant application has been rejected.',
      });
    },
    onError: (error) => {
      console.error('Failed to reject consultant:', error);
      toast({
        title: 'Failed to reject consultant',
        description: error.message || 'An error occurred while rejecting the consultant.',
        variant: 'destructive',
      });
    },
  });
};
