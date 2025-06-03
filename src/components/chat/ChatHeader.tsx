
import { ChatParticipant } from '@/hooks/useChatMessages';

interface ChatHeaderProps {
  participants: ChatParticipant[];
  currentUserId?: string;
}

export function ChatHeader({ participants, currentUserId }: ChatHeaderProps) {
  return (
    <div className="border-b border-mental-green-100 p-3">
      <div className="flex items-center">
        {participants
          .filter(p => p.id !== currentUserId)
          .map(participant => (
            <div key={participant.id} className="flex items-center">
              <img
                src={participant.image}
                alt={participant.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="ml-3">
                <h3 className="font-semibold">{participant.name}</h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChatHeader;
