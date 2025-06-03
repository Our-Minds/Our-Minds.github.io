
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Feature or unfeature a story
 */
export const featureStory = async (storyId: string, featured: boolean) => {
  const { error } = await supabase
    .from('stories')
    .update({ is_featured: featured })
    .eq('id', storyId);

  if (error) {
    throw new Error(error.message);
  }

  toast({
    title: featured ? 'Story Featured' : 'Story Unfeatured',
    description: featured 
      ? 'The story has been featured on the homepage.' 
      : 'The story has been removed from featured stories.',
    variant: 'success'
  });
};
