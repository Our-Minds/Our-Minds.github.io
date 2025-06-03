
import { useState } from 'react';
import { useChatThreads } from '@/hooks/useChatThreads';
import { useToast } from '@/hooks/use-toast';
import ChatSearch from '@/components/chat/ChatSearch';
import ChatThreadItem from '@/components/chat/ChatThreadItem';

interface ChatSidebarProps {
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatSidebar({ selectedChatId, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Use our custom hook to get thread data
  const { threadsWithDetails, isLoading, error } = useChatThreads();
  
  // Show toast on error
  if (error) {
    toast({
      title: "Error loading chats",
      description: "There was a problem loading your chat threads. Please try again later.",
      variant: "destructive"
    });
  }
  
  // Filter threads based on search query
  const filteredThreads = threadsWithDetails.filter(item => {
    const participantName = item.otherParticipant?.name || '';
    return participantName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="flex flex-col h-full border-r border-mental-green-100 bg-mental-green-50/80">
      <div className="p-4 border-b border-mental-green-100">
        <h2 className="text-lg font-semibold text-mental-green-800 mb-2">Chats</h2>
        <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading chats...</div>
        ) : filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chats found</div>
        ) : (
          filteredThreads.map((threadWithDetails) => (
            <ChatThreadItem 
              key={threadWithDetails.thread.id}
              threadWithDetails={threadWithDetails}
              isSelected={threadWithDetails.thread.id === selectedChatId}
              onClick={() => onSelectChat(threadWithDetails.thread.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;
