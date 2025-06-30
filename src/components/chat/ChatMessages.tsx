
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChatThread, groupMessagesByDate } from '@/utils/chatFormatters';
import MessageGroup from './MessageGroup';
import { VirtualList } from '@/components/ui/virtual-list';

interface ChatMessagesProps {
  chat: ChatThread;
  isMobile: boolean;
  messageAreaBottomPadding: string;
}

export function ChatMessages({
  chat,
  isMobile,
  messageAreaBottomPadding,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll to bottom on new messages with debouncing
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [chat.messages]);

  const messageGroups = groupMessagesByDate(chat.messages);

  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500",
        "scroll-smooth",
        isMobile ? "" : ""
      )}
      style={{
        WebkitOverflowScrolling: "touch"
      }}
    >
      <div className={cn('px-3 pt-4', messageAreaBottomPadding, "animate-fade-in")}>
        {messageGroups.map((group, groupIndex) => (
          <MessageGroup
            key={groupIndex}
            group={group}
            chat={chat}
            isMobile={isMobile}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatMessages;
