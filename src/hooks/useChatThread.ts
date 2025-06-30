
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { findOrCreateChatThread } from '@/utils/chatUtils';

export function useChatThread(consultantId?: string, threadId?: string) {
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // If threadId is provided directly in URL, use it
  useEffect(() => {
    if (threadId) {
      setSelectedChatId(threadId);
    }
  }, [threadId]);

  // If consultantId is provided in URL, find or set the correct chat thread
  useEffect(() => {
    if (consultantId && user) {
      const findOrCreateThread = async () => {
        try {
          // First check if consultantId is actually a thread ID
          const { data: threadCheck, error: threadCheckError } = await supabase
            .from('chat_threads')
            .select('*')
            .eq('id', consultantId)
            .maybeSingle();
            
          if (!threadCheckError && threadCheck) {
            // If it's a valid thread ID, just use it
            setSelectedChatId(consultantId);
            // Update URL to use correct path format
            navigate(`/chat/${consultantId}`, { replace: true });
            return;
          }
          
          // Otherwise, treat it as a consultant ID and create/find a thread
          const thread = await findOrCreateChatThread(consultantId, user.id);
          setSelectedChatId(thread.id);
          
          // Update URL to use correct path format
          navigate(`/chat/${thread.id}`, { replace: true });
          
          // Invalidate chat threads query to refresh the sidebar
          queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
        } catch (err) {
          console.error('Error setting up chat thread:', err);
          toast({
            title: 'Error',
            description: 'Could not create chat thread',
            variant: 'destructive',
          });
        }
      };
      
      findOrCreateThread();
    }
  }, [consultantId, user, queryClient, toast, navigate]);

  return {
    selectedChatId,
    setSelectedChatId
  };
}
