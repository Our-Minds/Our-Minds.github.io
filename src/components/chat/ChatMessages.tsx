import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChatParticipant } from '@/hooks/useChatMessages';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  senderName: string;
  senderImage: string;
  image?: string;
}

interface ChatThread {
  id: string;
  messages: Message[];
  participants: ChatParticipant[];
  lastActive: string;
}

interface ChatMessagesProps {
  chat: ChatThread;
}

export function ChatMessages({ chat }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const groupMessagesByDate = (messages: ChatThread['messages']) => {
    const groups: { date: string; messages: typeof messages }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: messageDate,
          messages: [message],
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const messageGroups = groupMessagesByDate(chat.messages);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {getFormattedDate(group.date)}
            </span>
          </div>

          {group.messages.map((message) => {
            const isCurrentUser =
              chat.participants.find((p) => p.name === 'You')?.id === message.senderId;

            return (
              <div
                key={message.id}
                className={cn('flex mb-4', isCurrentUser ? 'justify-end' : 'justify-start')}
              >
                <div className="max-w-[70%]">
                  <div
                    className={cn(
                      'p-3 rounded-lg',
                      isCurrentUser
                        ? 'bg-mental-green-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    )}
                  >
                    {message.content}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Message attachment"
                        className="mt-2 rounded-md max-w-full h-auto"
                      />
                    )}
                  </div>

                  <div
                    className={cn(
                      'text-xs text-gray-500 mt-1',
                      isCurrentUser ? 'text-right' : 'text-left'
                    )}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
