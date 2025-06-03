import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  thread_id: string;
  created_at: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  image: string;
}

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

export function useChatMessages(selectedChatId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch thread details
  const { data: threadDetails, isLoading: isLoadingThreadDetails } = useQuery({
    queryKey: ['threadDetails', selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return null;

      const { data: thread, error } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('id', selectedChatId)
        .single();

      if (error) throw error;

      // Fetch user details for both participants
      const userIds = [thread.user_id, thread.consultant_id];
      const { data: userProfiles, error: userError } = await supabase
        .from('users')
        .select('id, name, profile_image')
        .in('id', userIds);

      if (userError) throw userError;

      return {
        thread,
        participants: userProfiles,
      } as ThreadDetails;
    },
    enabled: !!selectedChatId,
  });

  // Fetch messages for the selected chat thread
  const { data: messages } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', selectedChatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!selectedChatId,
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedChatId) throw new Error('No chat selected');

      const message = {
        thread_id: selectedChatId,
        sender_id: user.id,
        content,
      };

      const { error } = await supabase.from('chat_messages').insert([message]);

      if (error) throw error;

      const { error: threadError } = await supabase
        .from('chat_threads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedChatId);

      if (threadError) throw threadError;
    },
    onError: (error) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });

  // Mark messages as read when thread is viewed
  useEffect(() => {
    if (!selectedChatId || !user) return;

    const markMessagesAsRead = async () => {
      try {
        await supabase.rpc('mark_messages_as_read', {
          p_thread_id: selectedChatId,
          p_user_id: user.id,
        });

        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();
  }, [selectedChatId, user, messages, queryClient]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!selectedChatId) return;

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
  }, [selectedChatId, queryClient]);

  // Transform participants for UI
  const chatParticipants: ChatParticipant[] = [];

  if (threadDetails && user) {
    // Add current user without fallback avatar
    chatParticipants.push({
      id: user.id,
      name: 'You',
      image: user?.user_metadata?.avatar_url || '',
    });

    // Add other participant without fallback avatar
    const otherParticipantId =
      threadDetails.thread.user_id === user.id
        ? threadDetails.thread.consultant_id
        : threadDetails.thread.user_id;

    const otherParticipant = threadDetails.participants?.find((p) => p.id === otherParticipantId);

    if (otherParticipant) {
      chatParticipants.push({
        id: otherParticipant.id,
        name: otherParticipant.name || 'User',
        image: otherParticipant.profile_image || '',
      });
    }
  }

  // Transform messages for the UI
  const transformedMessages =
    messages?.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      content: msg.content,
      timestamp: msg.created_at,
      senderName:
        msg.sender_id === user?.id
          ? 'You'
          : chatParticipants.find((p) => p.id === msg.sender_id)?.name || 'Other User',
      senderImage:
        msg.sender_id === user?.id
          ? user.user_metadata?.avatar_url || ''
          : chatParticipants.find((p) => p.id === msg.sender_id)?.image || '',
    })) ?? [];

  return {
    threadDetails,
    isLoadingThreadDetails,
    chatParticipants,
    transformedMessages,
    sendMessage: (content: string) => sendMessageMutation.mutate(content),
  };
}
