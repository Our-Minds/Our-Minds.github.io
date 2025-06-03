
import { supabase } from '@/integrations/supabase/client';
import { QuickAction } from '@/components/admin/QuickActionsPanel';

/**
 * Fetch pending consultants for quick actions
 */
export const fetchPendingConsultants = async (approveConsultantFn: (id: string) => Promise<void>): Promise<QuickAction[]> => {
  try {
    // Get consultant IDs that are pending approval
    const { data: consultantsData, error: consultantsError } = await supabase
      .from('consultants')
      .select(`
        id,
        specialization,
        created_at
      `)
      .eq('available', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (consultantsError) {
      console.error('Error fetching pending consultants:', consultantsError);
      return [];
    }

    // Create an array to hold the results
    const pendingActions: QuickAction[] = [];

    // For each consultant, fetch the user data separately
    if (consultantsData && consultantsData.length > 0) {
      for (const consultant of consultantsData) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name')
            .eq('id', consultant.id)
            .maybeSingle();

          if (userError) {
            console.warn(`Couldn't get user data for consultant ${consultant.id}:`, userError);
            // If we can't get user data, still show the consultant with a default name
            pendingActions.push({
              id: `approve-${consultant.id}`,
              title: `Approve Consultant`,
              description: `Pending approval since ${new Date(consultant.created_at).toLocaleDateString()}`,
              execute: () => approveConsultantFn(consultant.id),
              variant: 'default'
            });
            continue;
          }

          pendingActions.push({
            id: `approve-${consultant.id}`,
            title: `Approve ${userData?.name || 'Consultant'}`,
            description: `Pending approval since ${new Date(consultant.created_at).toLocaleDateString()}`,
            execute: () => approveConsultantFn(consultant.id),
            variant: 'default'
          });
        } catch (error) {
          console.error(`Error fetching user data for consultant ${consultant.id}:`, error);
        }
      }
    }

    return pendingActions;
  } catch (error) {
    console.error('Error in fetchPendingConsultants:', error);
    return [];
  }
};

/**
 * Fetch recent stories for quick actions
 */
export const fetchRecentStories = async (featureStoryFn: (id: string, featured: boolean) => Promise<void>): Promise<QuickAction[]> => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, created_at, is_featured')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent stories:', error);
      return [];
    }

    return (data || []).map(story => ({
      id: `feature-${story.id}`,
      title: story.is_featured ? `Unfeature "${story.title || 'Untitled'}"` : `Feature "${story.title || 'Untitled'}"`,
      description: `Published ${new Date(story.created_at).toLocaleDateString()}`,
      execute: () => featureStoryFn(story.id, !story.is_featured),
      variant: story.is_featured ? 'destructive' : 'default'
    }));
  } catch (error) {
    console.error('Error in fetchRecentStories:', error);
    return [];
  }
};

/**
 * Fetch current platform fee
 */
export const fetchCurrentPlatformFee = async (): Promise<number> => {
  try {
    // Get all platform settings (not filtering by ID since we don't know the format of the ID)
    const { data, error } = await supabase
      .from('platform_settings')
      .select('platform_fee_percentage')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching platform fee:', error);
      return 10; // Default value
    }
    
    return data?.platform_fee_percentage || 10;
  } catch (error) {
    console.error('Error fetching platform fee:', error);
    return 10; // Default value
  }
};
