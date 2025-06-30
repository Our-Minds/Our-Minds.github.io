
import { supabase } from '@/integrations/supabase/client';
import { ChatThread } from './types';

export async function fetchChatThreads(userId?: string): Promise<ChatThread[]> {
  if (!userId) return [];
  
  console.log("Fetching chat threads for user:", userId);
  
  try {
    const { data, error } = await supabase
      .from('chat_threads')
      .select('*')
      .or(`user_id.eq.${userId},consultant_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching threads:", error);
      throw error;
    }
    
    return data as ChatThread[];
  } catch (err) {
    console.error("Error in chat threads query:", err);
    throw err;
  }
}
