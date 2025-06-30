
import React from 'react';
import { cn } from '@/lib/utils';
import { ThreadWithDetails } from '@/hooks/useChatThreads';
import { useAuth } from '@/context/AuthContext';
import { useUserPresence } from '@/hooks/useUserPresence';

interface ChatThreadItemProps {
  thread: ThreadWithDetails;
}

export function ChatThreadItem({ thread }: ChatThreadItemProps) {
  const { user } = useAuth();
  const { isUserOnline } = useUserPresence();
  const { lastMessage, otherParticipant } = thread;

  const DEFAULT_PROFILE_IMAGE = "https://raw.githubusercontent.com/Our-Minds/our-minds.github.io/refs/heads/main/public/assets/default.png";
  const imageSrc = otherParticipant?.profile_image
    ? otherParticipant.profile_image
    : DEFAULT_PROFILE_IMAGE;

  const isOnline = isUserOnline(otherParticipant.id);

  return (
    <div className="w-full flex items-center gap-3 p-4 group transition-all duration-150">
      <div className="relative flex-shrink-0">
        <img
          src={imageSrc}
          alt={otherParticipant?.name || 'User'}
          className="w-11 h-11 rounded-full object-cover ring-1 ring-[#e0e4dd] dark:ring-[#222] shadow group-hover:ring-[#025803]/40 transition-all duration-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
          }}
        />
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1a1a1a] shadow
            ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}
          `}
        ></div>
      </div>
      <div className="ml-1 text-left flex-1 overflow-hidden">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
            {otherParticipant?.name || 'Unknown User'}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2 font-medium">
              {new Date(lastMessage.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        {lastMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate leading-relaxed">
            <span
              className={cn(
                lastMessage.sender_id === user?.id
                  ? 'text-[#025803] dark:text-[#025803] font-medium'
                  : ''
              )}
            >
              {lastMessage.sender_id === user?.id ? 'You: ' : ''}
            </span>
            {lastMessage.content}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatThreadItem;
