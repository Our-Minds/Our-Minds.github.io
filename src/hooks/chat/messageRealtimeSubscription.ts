
import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';

export function setupMessageRealtimeSubscription(
  selectedChatId: string,
  queryClient: QueryClient
) {
  const channel = supabase
    .channel('chat-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `thread_id=eq.${selectedChatId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
