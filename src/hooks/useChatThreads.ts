
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { fetchChatThreads } from './chat/fetchChatThreads';
import { fetchChatMessages } from './chat/fetchChatMessages';
import { fetchUserProfiles } from './chat/fetchUserProfiles';
import { processThreadData } from './chat/processThreadData';
import { setupRealtimeSubscriptions } from './chat/realtimeSubscriptions';
import { useEffect, useMemo } from 'react';
import { ChatThread, ChatMessage, UserProfile } from './chat/types';

export interface ThreadWithDetails {
  thread: ChatThread;
  lastMessage?: ChatMessage;
  otherParticipant: UserProfile;
}

export function useChatThreads() {
  const { user } = useAuth();

  const { data: chatThreads, error: threadsError, refetch } = useQuery({
    queryKey: ['chatThreads', user?.id],
    queryFn: () => fetchChatThreads(user?.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: messagesData, error: messagesError } = useQuery({
    queryKey: ['chatMessages', chatThreads?.map(t => t.id)],
    queryFn: () => fetchChatMessages(chatThreads),
    enabled: !!chatThreads && chatThreads.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for messages
  });

  const { data: userProfiles, error: profilesError } = useQuery({
    queryKey: ['userProfiles', chatThreads?.map(t => [t.user_id, t.consultant_id]).flat()],
    queryFn: () => fetchUserProfiles(chatThreads),
    enabled: !!chatThreads && chatThreads.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes for user profiles
  });

  useEffect(() => {
    if (!user?.id) return;
    
    const cleanup = setupRealtimeSubscriptions(user.id, refetch);
    return cleanup;
  }, [user?.id, refetch]);

  const threadsWithDetails = useMemo(() => 
    processThreadData(user, chatThreads || [], messagesData, userProfiles),
    [user, chatThreads, messagesData, userProfiles]
  );

  return {
    threads: threadsWithDetails,
    isLoading: !chatThreads,
    error: threadsError || messagesError || profilesError,
  };
}
