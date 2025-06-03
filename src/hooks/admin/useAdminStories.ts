
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { StoryData } from './types';

// Hook to fetch stories for moderation
export const useStoriesModeration = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-stories'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }

      return data as StoryData[];
    },
    enabled: !!isAdmin,
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook to toggle the featured status of a story
export const useToggleStoryFeature = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async ({ storyId, isFeatured }: { storyId: string, isFeatured: boolean }) => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('stories')
        .update({ is_featured: isFeatured })
        .eq('id', storyId);

      if (error) {
        throw error;
      }

      return { storyId, isFeatured };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
      toast({
        title: 'Story updated',
        description: 'The story feature status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update story',
        description: error.message || 'An error occurred while updating the story.',
        variant: 'destructive',
      });
    },
  });
};
