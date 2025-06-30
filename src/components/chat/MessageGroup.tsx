
import MessageItem from './MessageItem';
import { getFormattedDate, Message, ChatThread } from '@/utils/chatFormatters';

interface MessageGroupProps {
  group: { date: string; messages: Message[] };
  chat: ChatThread;
  isMobile: boolean;
}

export function MessageGroup({ group, chat, isMobile }: MessageGroupProps) {
  return (
    <div className={isMobile ? 'mb-4' : 'mb-6'}>
      <div className="flex justify-center mb-3">
        <span className={`
          px-3 py-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-full 
          font-medium text-gray-600 dark:text-gray-300
          text-xs
        `}>
          {getFormattedDate(group.date)}
        </span>
      </div>

      {group.messages.map((message) => {
        const isCurrentUser =
          chat.participants.find((p) => p.name === 'You')?.id === message.senderId;

        return (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
}

export default MessageGroup;
