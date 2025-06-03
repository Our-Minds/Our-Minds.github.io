
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { PlatformSettings } from './types';

// Hook to fetch admin settings
export const useAdminSettings = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async (): Promise<PlatformSettings> => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }
      
      try {
        // Get the first (and likely only) row from platform_settings
        const { data, error } = await supabase
          .from('platform_settings')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching platform settings:', error);
          throw error;
        }
        
        // If no settings exist yet, create a default entry
        if (!data) {
          console.log('No platform settings found, creating default');
          const defaultSettings = {
            mission: 'Our mission is to make mental health support accessible to everyone, everywhere.',
            vision: 'We envision a world where mental health is treated with the same importance as physical health.',
            values: 'Compassion, Accessibility, Quality, Privacy, and Inclusion.',
            platform_fee_percentage: 4,
          };
          
          const { data: newData, error: insertError } = await supabase
            .from('platform_settings')
            .insert(defaultSettings)
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating default platform settings:', insertError);
            throw insertError;
          }
          
          return newData as PlatformSettings;
        }
        
        return data as PlatformSettings;
      } catch (err) {
        console.error('Error in useAdminSettings:', err);
        throw err;
      }
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to save settings
export const useSaveSettings = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async (settings: Partial<PlatformSettings>) => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }
      
      // First get the current settings ID or create if it doesn't exist
      let settingsId: string;
      
      const { data: existingSettings, error: fetchError } = await supabase
        .from('platform_settings')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
        
      if (fetchError) {
        // Create new settings if none exist
        if (fetchError.code === 'PGRST116') {
          const { data: newSettings, error: insertError } = await supabase
            .from('platform_settings')
            .insert(settings)
            .select('id')
            .single();
            
          if (insertError) throw insertError;
          if (!newSettings) throw new Error('Failed to create settings');
          
          settingsId = newSettings.id;
        } else {
          throw fetchError;
        }
      } else {
        settingsId = existingSettings.id;
        
        // Update existing settings
        const { error: updateError } = await supabase
          .from('platform_settings')
          .update(settings)
          .eq('id', settingsId);
          
        if (updateError) throw updateError;
      }
      
      return { ...settings, id: settingsId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: 'Settings saved',
        description: 'Platform settings have been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to save settings',
        description: error.message || 'An error occurred while saving settings.',
        variant: 'destructive',
      });
    },
  });
};
