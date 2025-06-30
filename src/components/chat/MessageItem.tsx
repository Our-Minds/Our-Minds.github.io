
import { cn } from '@/lib/utils';
import { Message } from '@/utils/chatFormatters';
import MessageAttachment from './MessageAttachment';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  isMobile: boolean;
}

export function MessageItem({ message, isCurrentUser, isMobile }: MessageItemProps) {
  return (
    <div
      className={cn(
        'flex mb-3',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={`
        ${isMobile ? 'max-w-[85%]' : 'max-w-[70%]'}
      `}>
        <div
          className={cn(
            'p-3 rounded-lg break-words',
            isMobile ? 'text-sm' : 'text-base',
            isCurrentUser
              ? 'bg-[#025803] text-white rounded-br-none'
              : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 rounded-bl-none'
          )}
        >
          {message.content}
          {message.image && (
            <img
              src={message.image}
              alt="Message attachment"
              className={`
                mt-2 rounded-md max-w-full h-auto
                ${isMobile ? 'max-h-48' : 'max-h-64'}
              `}
            />
          )}
          <MessageAttachment message={message} isMobile={isMobile} />
        </div>

        <div
          className={cn(
            'text-xs text-gray-500 dark:text-gray-400 mt-1',
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
}

export default MessageItem;
