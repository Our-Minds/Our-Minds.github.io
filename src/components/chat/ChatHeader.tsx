
import { cn } from '@/lib/utils';
import { ChatParticipant } from '@/hooks/useChatMessages';
import { useUserPresence } from '@/hooks/useUserPresence';

interface ChatHeaderProps {
  participants: ChatParticipant[];
  currentUserId?: string;
  className?: string;
}

export function ChatHeader({
  participants,
  currentUserId,
  className,
}: ChatHeaderProps) {
  const { isUserOnline } = useUserPresence();

  const DEFAULT_PROFILE_IMAGE =
    'https://raw.githubusercontent.com/Our-Minds/our-minds.github.io/refs/heads/main/public/assets/default.png';

  return (
    <div className={cn('flex items-center w-full gap-6', className, 'animate-fade-in')}>
      {participants
        .filter((p) => p.id !== currentUserId)
        .map((participant) => {
          const isOnline = isUserOnline(participant.id);
          const imageSrc = participant.image
            ? participant.image
            : DEFAULT_PROFILE_IMAGE;
          return (
            <div key={participant.id} className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={imageSrc}
                  alt={participant.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-mental-green-100 dark:ring-[#025803]/30 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#1a1a1a] shadow ${
                    isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}
                  title={isOnline ? 'Online' : 'Offline'}
                ></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {participant.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? 'bg-green-400' : 'bg-gray-400'
                    }`}
                  ></div>
                  <p
                    className={`text-sm font-medium ${
                      isOnline
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ChatHeader;
