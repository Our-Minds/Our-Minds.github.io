
import ChatHeader from '@/components/chat/ChatHeader';
import { ChatParticipant } from '@/hooks/useChatMessages';

interface ChatHeaderContainerProps {
  chatParticipants: ChatParticipant[];
  currentUserId?: string;
}

export default function ChatHeaderContainer({
  chatParticipants,
  currentUserId,
}: ChatHeaderContainerProps) {
  // This container is now sticky and includes backdrop blur for a nice effect.
  return (
    <div className="sticky top-0 shrink-0 z-20 shadow-sm border-b border-gray-100 dark:border-[#2a2a2a] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm">
      <ChatHeader
        participants={chatParticipants}
        currentUserId={currentUserId}
        className="px-6 py-4"
      />
    </div>
  );
}
