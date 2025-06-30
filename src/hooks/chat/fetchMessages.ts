
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '../useChatMessages';

export async function fetchMessages(selectedChatId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', selectedChatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as ChatMessage[];
}
