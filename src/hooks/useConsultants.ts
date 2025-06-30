
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsultantData {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  specialization: string[];
  languages: string[];
  location: string;
  bio: string;
  hourly_rate: number;
  available: boolean;
}

export function useConsultants() {
  const [consultants, setConsultants] = useState<ConsultantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching consultants...');
        
        // First, get approved consultants
        const { data: consultantsData, error: consultantsError } = await supabase
          .from('consultants')
          .select('*')
          .eq('approval_status', 'approved');

        if (consultantsError) {
          console.error('Error fetching consultants:', consultantsError);
          throw consultantsError;
        }

        console.log('Consultants data:', consultantsData);

        if (!consultantsData || consultantsData.length === 0) {
          console.log('No approved consultants found');
          setConsultants([]);
          return;
        }

        // Get user IDs for the consultants
        const consultantIds = consultantsData.map(c => c.id);
        
        // Fetch user details for these consultant IDs
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, name, email, profile_image')
          .in('id', consultantIds);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }

        console.log('Users data:', usersData);

        // Combine consultant and user data
        const transformedData: ConsultantData[] = consultantsData.map((consultant) => {
          const userData = usersData?.find(user => user.id === consultant.id);
          return {
            id: consultant.id,
            name: userData?.name || 'Unknown',
            email: userData?.email || '',
            profile_image: userData?.profile_image || '',
            specialization: consultant.specialization || [],
            languages: consultant.languages || [],
            location: consultant.location || '',
            bio: consultant.bio || '',
            hourly_rate: consultant.hourly_rate || 0,
            available: consultant.available || false,
          };
        });

        console.log('Transformed consultant data:', transformedData);
        setConsultants(transformedData);
      } catch (error: any) {
        console.error('Error in fetchConsultants:', error);
        toast({
          title: 'Failed to load consultants',
          description: error.message || 'Could not retrieve consultants from the database',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, [toast]);

  return { consultants, isLoading };
}
