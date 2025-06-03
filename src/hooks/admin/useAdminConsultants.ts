
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { ConsultantApplicationData } from './types';

// Hook to fetch pending consultant applications
export const usePendingConsultants = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['pending-consultants'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      try {
        // In a real app, this would filter by a status field
        // This is a mock implementation for now
        const { data, error } = await supabase
          .from('consultants')
          .select(`
            id, 
            specialization, 
            created_at
          `)
          .eq('available', false)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching consultants:', error);
          throw error;
        }

        // For each consultant, fetch their user data
        const applications: ConsultantApplicationData[] = [];
        
        for (const consultant of data || []) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', consultant.id)
              .single();

            if (userError) {
              console.warn(`Couldn't get user data for consultant ${consultant.id}:`, userError);
              
              // Still add the consultant with placeholder data
              applications.push({
                id: consultant.id,
                name: 'Unknown',
                email: 'no-email@example.com',
                specialization: consultant.specialization || [],
                submittedDate: format(new Date(consultant.created_at), 'yyyy-MM-dd'),
              });
              continue;
            }

            applications.push({
              id: consultant.id,
              name: userData?.name || 'Unknown',
              email: userData?.email || 'no-email@example.com',
              specialization: consultant.specialization || [],
              submittedDate: format(new Date(consultant.created_at), 'yyyy-MM-dd'),
            });
          } catch (err) {
            console.error(`Error processing consultant ${consultant.id}:`, err);
          }
        }

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

      const { error } = await supabase
        .from('consultants')
        .update({ available: true })
        .eq('id', consultantId);

      if (error) {
        throw error;
      }

      return { consultantId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-consultants'] });
      toast({
        title: 'Consultant approved',
        description: 'The consultant has been approved and can now accept sessions.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to approve consultant',
        description: error.message || 'An error occurred while approving the consultant.',
        variant: 'destructive',
      });
    },
  });
};
