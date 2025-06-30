
export interface ChatThread {
  id: string;
  user_id: string;
  consultant_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  content: string;
  created_at: string;
  sender_id: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  profile_image?: string;
}

export interface ThreadWithDetails {
  thread: ChatThread;
  lastMessage?: ChatMessage;
  otherParticipant: UserProfile;
}
