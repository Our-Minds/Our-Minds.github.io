
import React from 'react';
import { cn } from '@/lib/utils';
import { ThreadWithDetails } from '@/hooks/useChatThreads';
import { useAuth } from '@/context/AuthContext';

interface ChatThreadItemProps {
  threadWithDetails: ThreadWithDetails;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatThreadItem({ threadWithDetails, isSelected, onClick }: ChatThreadItemProps) {
  const { user } = useAuth();
  const { thread, lastMessage, otherParticipant } = threadWithDetails;
  
  return (
    <button
      className={cn(
        'w-full flex items-center p-3 hover:bg-mental-green-100 transition-colors border-b border-mental-green-100/50',
        isSelected ? 'bg-mental-green-100' : ''
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={otherParticipant?.profile_image || '/placeholder.svg'}
          alt={otherParticipant?.name || 'User'}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </div>
      
      <div className="ml-3 text-left flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate">{otherParticipant?.name || 'Unknown User'}</h3>
          {lastMessage && (
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {new Date(lastMessage.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </div>
        
        {lastMessage && (
          <p className="text-sm text-gray-600 truncate">
            {lastMessage.sender_id === user?.id ? 'You: ' : ''}
            {lastMessage.content}
          </p>
        )}
      </div>
    </button>
  );
}

export default ChatThreadItem;
