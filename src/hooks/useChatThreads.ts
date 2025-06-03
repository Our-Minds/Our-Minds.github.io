
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Define types for the data we'll be working with
export interface ChatThread {
  id: string;
  user_id: string;
  consultant_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  content: string;
  created_at: string;
  sender_id: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  profile_image?: string;
}

export interface ThreadWithDetails {
  thread: ChatThread;
  lastMessage?: ChatMessage;
  otherParticipant: UserProfile;
}

export function useChatThreads() {
  const { user } = useAuth();
  const [threadsWithDetails, setThreadsWithDetails] = useState<ThreadWithDetails[]>([]);
  
  // 1. Fetch chat threads where the current user is either the user or the consultant
  const { 
    data: chatThreads, 
    isLoading: isLoadingThreads, 
    error: threadsError, 
    refetch 
  } = useQuery({
    queryKey: ['chatThreads', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("Fetching chat threads for user:", user.id);
      
      try {
        const { data, error } = await supabase
          .from('chat_threads')
          .select('*')
          .or(`user_id.eq.${user.id},consultant_id.eq.${user.id}`)
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
    },
    enabled: !!user,
  });

  // 2. Fetch messages for all threads
  const { 
    data: messagesData, 
    isLoading: isLoadingMessages, 
    error: messagesError 
  } = useQuery({
    queryKey: ['chatMessages', chatThreads?.map(t => t.id).join(',')],
    queryFn: async () => {
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
        
        // Group messages by thread_id
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
    },
    enabled: !!chatThreads && chatThreads.length > 0,
  });

  // 3. Fetch user profiles for all participants
  const { 
    data: userProfiles, 
    isLoading: isLoadingProfiles, 
    error: profilesError 
  } = useQuery({
    queryKey: ['chatUsers', chatThreads?.map(t => `${t.user_id},${t.consultant_id}`).join(',')],
    queryFn: async () => {
      if (!chatThreads || chatThreads.length === 0) return {};
      
      // Get unique user IDs from all threads
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
        
        // Create a map of user profiles by ID for easy lookup
        const profilesById: Record<string, UserProfile> = {};
        data?.forEach((profile: UserProfile) => {
          profilesById[profile.id] = profile;
        });
        
        return profilesById;
      } catch (err) {
        console.error("Error fetching user profiles:", err);
        throw err;
      }
    },
    enabled: !!chatThreads && chatThreads.length > 0,
  });

  // Process all the data to create our threads with details
  useEffect(() => {
    if (!user || !chatThreads || isLoadingMessages || isLoadingProfiles) return;

    try {
      const processed = chatThreads.map(thread => {
        // Find the other participant in the thread (not the current user)
        const otherParticipantId = thread.user_id === user.id ? thread.consultant_id : thread.user_id;
        const otherParticipant = userProfiles?.[otherParticipantId] || { 
          id: otherParticipantId,
          name: 'Unknown User',
          profile_image: '/placeholder.svg'
        };
        
        // Get the last message in the thread, if any
        const threadMessages = messagesData?.[thread.id] || [];
        const lastMessage = threadMessages.length > 0 ? threadMessages[0] : undefined;
        
        return {
          thread,
          lastMessage,
          otherParticipant
        };
      });
      
      setThreadsWithDetails(processed);
    } catch (err) {
      console.error("Error processing thread data:", err);
    }
  }, [user, chatThreads, messagesData, userProfiles, isLoadingMessages, isLoadingProfiles]);

  // Add real-time updates for chat threads
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('chat_threads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_threads',
          filter: `user_id=eq.${user.id}`,
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
          filter: `consultant_id=eq.${user.id}`,
        },
        () => {
          console.log("Consultant chat thread changed, refetching...");
          refetch();
        }
      )
      .subscribe();
    
    // Also listen for new messages
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
  }, [user, refetch]);

  return {
    threadsWithDetails,
    isLoading: isLoadingThreads || isLoadingMessages || isLoadingProfiles,
    error: threadsError || messagesError || profilesError,
    refetch
  };
}
