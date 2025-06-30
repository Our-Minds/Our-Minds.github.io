
import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';

export async function markMessagesAsRead(
  selectedChatId: string,
  userId: string,
  queryClient: QueryClient
) {
  try {
    await supabase.rpc('mark_messages_as_read', {
      p_thread_id: selectedChatId,
      p_user_id: userId,
    });

    queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}
