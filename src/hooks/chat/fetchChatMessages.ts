
import { supabase } from '@/integrations/supabase/client';
import { ChatThread, ChatMessage } from './types';

export async function fetchChatMessages(chatThreads?: ChatThread[]): Promise<Record<string, ChatMessage[]>> {
  if (!chatThreads || chatThreads.length === 0) return {};
  
  const threadIds = chatThreads.map(t => t.id);
  const messagesByThreadId: Record<string, ChatMessage[]> = {};
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
    
    data?.forEach((message: any) => {
      if (!messagesByThreadId[message.thread_id]) {
        messagesByThreadId[message.thread_id] = [];
      }
      messagesByThreadId[message.thread_id].push(message);
    });
    
    return messagesByThreadId;
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
}
