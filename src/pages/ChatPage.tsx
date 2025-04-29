import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatEmptyState from '@/components/chat/ChatEmptyState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  thread_id: string;
  created_at: string;
}

interface ChatThread {
  id: string;
  user_id: string;
  consultant_id: string;
  last_message_at: string;
}

export function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: chatThreads } = useQuery({
    queryKey: ['chatThreads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data as ChatThread[];
    },
    enabled: !!user,
  });

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

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedChatId) throw new Error('No chat selected');

      const message = {
        thread_id: selectedChatId,
        sender_id: user.id,
        content,
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert([message]);

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
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatId, queryClient]);

  const transformedMessages = messages?.map(msg => ({
    id: msg.id,
    senderId: msg.sender_id,
    content: msg.content,
    timestamp: msg.created_at,
    senderName: msg.sender_id === user?.id ? 'You' : 'Consultant',
    senderImage: msg.sender_id === user?.id 
      ? user.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?img=1'
      : 'https://i.pravatar.cc/150?img=2',
  })) ?? [];

  const selectedThread = chatThreads?.find(t => t.id === selectedChatId);
  const chatParticipants = selectedThread ? [
    {
      id: selectedThread.user_id,
      name: 'You',
      image: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: selectedThread.consultant_id,
      name: 'Consultant',
      image: 'https://i.pravatar.cc/150?img=2',
    }
  ] : [];

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-80 h-full">
          <ChatSidebar 
            selectedChatId={selectedChatId} 
            onSelectChat={setSelectedChatId}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <>
              <ChatHeader 
                participants={chatParticipants}
                currentUserId={user?.id}
              />
              <ChatMessages chat={{ 
                id: selectedChatId, 
                messages: transformedMessages,
                participants: chatParticipants,
                lastActive: selectedThread?.last_message_at ?? new Date().toISOString(),
              }} />
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <ChatEmptyState />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;
