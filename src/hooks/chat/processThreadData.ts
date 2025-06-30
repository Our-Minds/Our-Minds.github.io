
import { ChatThread, ChatMessage, UserProfile, ThreadWithDetails } from './types';

export function processThreadData(
  user: any,
  chatThreads: ChatThread[],
  messagesData?: Record<string, ChatMessage[]>,
  userProfiles?: Record<string, UserProfile>
): ThreadWithDetails[] {
  try {
    return chatThreads.map(thread => {
      const otherParticipantId = thread.user_id === user.id ? thread.consultant_id : thread.user_id;
      const otherParticipant = userProfiles?.[otherParticipantId] || { 
        id: otherParticipantId,
        name: 'Unknown User',
        profile_image: '/placeholder.svg'
      };
      
      const threadMessages = messagesData?.[thread.id] || [];
      const lastMessage = threadMessages.length > 0 ? threadMessages[0] : undefined;
      
      return {
        thread,
        lastMessage,
        otherParticipant
      };
    });
  } catch (err) {
    console.error("Error processing thread data:", err);
    return [];
  }
}
