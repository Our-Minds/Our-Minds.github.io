
import { supabase } from '@/integrations/supabase/client';

export interface ThreadDetails {
  thread: {
    id: string;
    user_id: string;
    consultant_id: string;
    last_message_at: string;
  };
  participants: {
    id: string;
    name?: string;
    profile_image?: string;
  }[];
}

export async function fetchThreadDetails(selectedChatId: string): Promise<ThreadDetails | null> {
  if (!selectedChatId) return null;

  const { data: thread, error } = await supabase
    .from('chat_threads')
    .select('*')
    .eq('id', selectedChatId)
    .single();

  if (error) throw error;

  const userIds = [thread.user_id, thread.consultant_id];
  const { data: userProfiles, error: userError } = await supabase
    .from('users')
    .select('id, name, profile_image')
    .in('id', userIds);

  if (userError) throw userError;

  return {
    thread,
    participants: userProfiles,
  };
}
