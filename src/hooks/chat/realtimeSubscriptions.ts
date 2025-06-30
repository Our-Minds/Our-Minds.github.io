
import { supabase } from '@/integrations/supabase/client';

export function setupRealtimeSubscriptions(userId: string, refetch: () => void) {
  const channel = supabase
    .channel('chat_threads_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_threads',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        console.log("User chat thread changed, refetching...");
        refetch();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_threads',
        filter: `consultant_id=eq.${userId}`,
      },
      () => {
        console.log("Consultant chat thread changed, refetching...");
        refetch();
      }
    )
    .subscribe();
  
  const messageChannel = supabase
    .channel('chat_messages_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      },
      () => {
        console.log("New message detected, refetching threads...");
        refetch();
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
    supabase.removeChannel(messageChannel);
  };
}
