
import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ChatSidebarProps {
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

// Define proper types for the chat thread data from Supabase
interface ChatThreadWithMessages {
  id: string;
  user_id: string;
  consultant_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  chat_messages?: {
    content: string;
    created_at: string;
    sender_id: string;
  }[];
  users?: {
    name?: string;
    profile_image?: string;
  };
}

export function ChatSidebar({ selectedChatId, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  
  // Fetch chat threads
  const { data: chatThreads } = useQuery({
    queryKey: ['chatThreads'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: threads, error } = await supabase
        .from('chat_threads')
        .select(`
          *,
          chat_messages!chat_messages_thread_id_fkey (
            content,
            created_at,
            sender_id
          ),
          users!chat_threads_consultant_id_fkey (
            name,
            profile_image
          )
        `)
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      return threads as ChatThreadWithMessages[];
    },
    enabled: !!user,
  });
  
  const filteredChats = chatThreads?.filter(chat => {
    // Handle potential undefined users safely
    const consultantName = chat.users?.name || '';
    return consultantName.toLowerCase().includes(searchQuery.toLowerCase());
  }) ?? [];
  
  return (
    <div className="flex flex-col h-full border-r border-mental-green-100 bg-mental-green-50/80">
      <div className="p-4 border-b border-mental-green-100">
        <h2 className="text-lg font-semibold text-mental-green-800 mb-2">Chats</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-8 pr-4 py-2 rounded-md border border-mental-green-200 focus:outline-none focus:ring-1 focus:ring-mental-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => {
          const lastMessage = chat.chat_messages?.[0];
          const consultantName = chat.users?.name || 'Consultant';
          const consultantImage = chat.users?.profile_image || 'https://i.pravatar.cc/150?img=2';
          
          return (
            <button
              key={chat.id}
              className={cn(
                'w-full flex items-center p-3 hover:bg-mental-green-100 transition-colors border-b border-mental-green-100/50',
                chat.id === selectedChatId ? 'bg-mental-green-100' : ''
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="relative">
                <img
                  src={consultantImage}
                  alt={consultantName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              
              <div className="ml-3 text-left flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{consultantName}</h3>
                  {lastMessage && (
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(lastMessage.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  )}
                </div>
                
                {lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {lastMessage.sender_id === user?.id ? 'You: ' : ''}
                    {lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChatSidebar;
