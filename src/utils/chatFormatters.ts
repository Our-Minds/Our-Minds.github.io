
import { ChatParticipant } from '@/hooks/useChatMessages';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  senderName: string;
  senderImage: string;
  image?: string;
  attachment_url?: string;
  attachment_type?: string;
  attachment_name?: string;
  attachment_size?: number;
}

export interface ChatThread {
  id: string;
  messages: Message[];
  participants: ChatParticipant[];
  lastActive: string;
}

export const groupMessagesByDate = (messages: Message[]) => {
  const groups: { date: string; messages: Message[] }[] = [];
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

export const getFormattedDate = (dateString: string) => {
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

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageType = (type: string) => {
  return type.startsWith('image/');
};
