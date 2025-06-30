
import { ChatParticipant } from '../useChatMessages';
import { ThreadDetails } from './fetchThreadDetails';

export function transformChatData(
  threadDetails: ThreadDetails | undefined,
  messages: any[] | undefined,
  user: any
) {
  const chatParticipants: ChatParticipant[] = [];

  if (threadDetails && user) {
    chatParticipants.push({
      id: user.id,
      name: 'You',
      image: user?.user_metadata?.avatar_url || '',
    });

    const otherParticipantId =
      threadDetails.thread.user_id === user.id
        ? threadDetails.thread.consultant_id
        : threadDetails.thread.user_id;

    const otherParticipant = threadDetails.participants?.find((p) => p.id === otherParticipantId);

    if (otherParticipant) {
      chatParticipants.push({
        id: otherParticipant.id,
        name: otherParticipant.name || 'User',
        image: otherParticipant.profile_image || '',
      });
    }
  }

  const transformedMessages =
    messages?.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      content: msg.content,
      timestamp: msg.created_at,
      senderName:
        msg.sender_id === user?.id
          ? 'You'
          : chatParticipants.find((p) => p.id === msg.sender_id)?.name || 'Other User',
      senderImage:
        msg.sender_id === user?.id
          ? user.user_metadata?.avatar_url || ''
          : chatParticipants.find((p) => p.id === msg.sender_id)?.image || '',
      attachment_url: msg.attachment_url,
      attachment_type: msg.attachment_type,
      attachment_name: msg.attachment_name,
      attachment_size: msg.attachment_size,
    })) ?? [];

  return { chatParticipants, transformedMessages };
}
