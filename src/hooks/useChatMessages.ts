
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { FileUploadResult } from '@/utils/fileUpload';
import { fetchThreadDetails } from './chat/fetchThreadDetails';
import { fetchMessages } from './chat/fetchMessages';
import { sendMessageMutation } from './chat/sendMessageMutation';
import { setupMessageRealtimeSubscription } from './chat/messageRealtimeSubscription';
import { markMessagesAsRead } from './chat/markMessagesAsRead';
import { transformChatData } from './chat/transformChatData';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  thread_id: string;
  created_at: string;
  attachment_url?: string;
  attachment_type?: string;
  attachment_name?: string;
  attachment_size?: number;
}

export interface ChatParticipant {
  id: string;
  name: string;
  image: string;
}

export function useChatMessages(selectedChatId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: threadDetails, isLoading: isLoadingThreadDetails } = useQuery({
    queryKey: ['threadDetails', selectedChatId],
    queryFn: () => fetchThreadDetails(selectedChatId),
    enabled: !!selectedChatId,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: () => fetchMessages(selectedChatId),
    enabled: !!selectedChatId,
  });

  const sendMessageMut = useMutation({
    mutationFn: ({ content, attachment }: { content: string; attachment?: FileUploadResult }) => 
      sendMessageMutation(user, selectedChatId, content, attachment),
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

  useEffect(() => {
    if (!selectedChatId || !user) return;
    markMessagesAsRead(selectedChatId, user.id, queryClient);
  }, [selectedChatId, user, messages, queryClient]);

  useEffect(() => {
    if (!selectedChatId) return;
    return setupMessageRealtimeSubscription(selectedChatId, queryClient);
  }, [selectedChatId, queryClient]);

  const { chatParticipants, transformedMessages } = transformChatData(
    threadDetails, 
    messages, 
    user
  );

  return {
    threadDetails,
    isLoadingThreadDetails,
    chatParticipants,
    transformedMessages,
    sendMessage: (content: string, attachment?: FileUploadResult) => 
      sendMessageMut.mutate({ content, attachment }),
  };
}
