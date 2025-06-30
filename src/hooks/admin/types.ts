
// Common types used across admin hooks
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryData {
  id: string;
  title: string;
  snippet: string;
  content: string;
  cover_image: string;
  author_id: string | null;
  tag_type: string;
  tags: string[];
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  status: string | null;
}

export interface ConsultantApplicationData {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  submittedDate: string;
}

export interface DashboardStats {
  totalUsers: number;
  recentStories: number;
  pendingApprovals: number;
}

export interface ActivityData {
  id: string;
  type: 'user_joined' | 'story_published' | 'session_booked';
  text: string;
  timestamp: string;
}

export interface PlatformSettings {
  id: string;
  mission: string;
  vision: string;
  values: string;
  paypal_client_id: string | null;
  paypal_client_secret: string | null;
  platform_fee_percentage: number;
  contact_email: string | null;
  enable_chat: boolean | null;
  enable_booking: boolean | null;
  enable_stories: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}
