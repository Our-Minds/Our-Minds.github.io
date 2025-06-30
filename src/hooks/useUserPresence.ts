
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserPresence {
  user_id: string;
  online_at: string;
  user_info: {
    name: string;
    profile_image?: string;
  };
}

export function useUserPresence() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [presenceChannel, setPresenceChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online_users');

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const userIds = new Set<string>();
        
        // Properly handle the presence state structure
        Object.keys(newState).forEach(presenceKey => {
          const presences = newState[presenceKey];
          if (presences && presences.length > 0) {
            // The presence data is stored in the key itself when using track()
            // or we need to look for our tracked data in the presence object
            presences.forEach((presence: any) => {
              if (presence.user_id) {
                userIds.add(presence.user_id);
              }
            });
          }
        });
        
        setOnlineUsers(userIds);
        console.log('Online users updated:', Array.from(userIds));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const userStatus: UserPresence = {
            user_id: user.id,
            online_at: new Date().toISOString(),
            user_info: {
              name: user.user_metadata?.name || user.email || 'Unknown User',
              profile_image: user.user_metadata?.avatar_url
            }
          };

          await channel.track(userStatus);
          console.log('User presence tracked:', userStatus);
        }
      });

    setPresenceChannel(channel);

    // Cleanup function
    return () => {
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  return {
    onlineUsers: Array.from(onlineUsers),
    isUserOnline,
    presenceChannel
  };
}
