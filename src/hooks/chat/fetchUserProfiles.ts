
import { supabase } from '@/integrations/supabase/client';
import { ChatThread, UserProfile } from './types';

export async function fetchUserProfiles(chatThreads?: ChatThread[]): Promise<Record<string, UserProfile>> {
  if (!chatThreads || chatThreads.length === 0) return {};
  
  const userIds = new Set<string>();
  chatThreads.forEach(thread => {
    userIds.add(thread.user_id);
    userIds.add(thread.consultant_id);
  });
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, profile_image')
      .in('id', Array.from(userIds));
      
    if (error) {
      console.error("Error fetching user profiles:", error);
      throw error;
    }
    
    const profilesById: Record<string, UserProfile> = {};
    data?.forEach((profile: UserProfile) => {
      profilesById[profile.id] = profile;
    });
    
    return profilesById;
  } catch (err) {
    console.error("Error fetching user profiles:", err);
    throw err;
  }
}
