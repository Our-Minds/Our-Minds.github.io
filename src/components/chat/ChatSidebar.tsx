import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatThreads } from '@/hooks/useChatThreads';
import ChatSearch from './ChatSearch';
import ChatThreadItem from './ChatThreadItem';
import { MessageSquare, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatSidebarProps {
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatSidebar({ selectedChatId, onSelectChat }: ChatSidebarProps) {
  const { user } = useAuth();
  const { threads, isLoading, error } = useChatThreads();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const filteredThreads = threads.filter(threadWithDetails => {
    if (!searchQuery) return true;
    const otherParticipant = threadWithDetails.otherParticipant;
    return otherParticipant.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">Error loading chats</p>
          <p className="text-red-400 dark:text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  // Minor: optimize search area
  return (
    <div className={`
      h-full flex flex-col bg-white dark:bg-[#1a1a1a] overflow-hidden
      ${isMobile ? 'rounded-none' : 'rounded-xl shadow-lg border border-gray-100 dark:border-[#2a2a2a]'}
      animate-fade-in
    `}>
      {/* Fixed Header - NEVER scrolls */}
      <div className={`
        shrink-0 bg-white dark:bg-[#1a1a1a]
        ${isMobile ? 'p-3' : 'p-5'} 
        border-b border-gray-100 dark:border-[#2a2a2a]
      `}>
        <div className={`
          flex items-center gap-3 
          ${isMobile ? 'mb-2' : 'mb-3'}
        `}>
          <div className="w-9 h-9 bg-mental-green-100 dark:bg-[#025803]/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-mental-green-600 dark:text-[#025803]" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Messages</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{filteredThreads.length} conversations</p>
          </div>
        </div>
        <ChatSearch 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      {/* Conversations List */}
      <div className="flex-1">
        {isLoading ? (
          <div className={`${isMobile ? 'p-3' : 'p-5'} space-y-4`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-[#2a2a2a] rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-[#2a2a2a] rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 dark:bg-[#2f2f2f] rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try searching for someone else' : 'Start a conversation with a consultant'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-1 md:p-2">
            {filteredThreads.map(threadWithDetails => (
              <div
                key={threadWithDetails.thread.id}
                className={`
                  cursor-pointer rounded-xl transition-all duration-200 animate-fade-in
                  active:scale-96 touch-manipulation
                  ${selectedChatId === threadWithDetails.thread.id 
                    ? 'bg-[#025803]/10 border border-[#025803]/40 dark:bg-[#025803]/20 dark:border-[#025803]/30 shadow-sm scale-105'
                    : 'hover:bg-gray-50 dark:hover:bg-[#252525] active:bg-gray-100 dark:active:bg-[#2a2a2a]'
                  }
                `}
                onClick={() => onSelectChat(threadWithDetails.thread.id)}
              >
                <ChatThreadItem thread={threadWithDetails} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;
