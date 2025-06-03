
// Common types for consultant-related data
export interface ConsultantDetails {
  id?: string;
  specialization: string[];
  languages: string[];
  location: string;
  bio: string;
  rating: number;
  review_count: number;
  hourly_rate: number;
  available: boolean;
}

export interface Consultant {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  specialization: string[];
  languages: string[];
  location: string;
  bio: string;
  rating: number;
  review_count: number;
  hourly_rate: number;
  available: boolean;
}

export interface ConsultantAvailability {
  day: string;
  slots: string[];
}

export interface ConsultantAvailabilityRecord {
  id: string;
  consultant_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface BookableConsultant extends Consultant {
  isOnline: boolean;
  availability: ConsultantAvailability[];
}

export interface ConsultantUser {
  id: string;
  name: string;
  profile_image: string | null;
}

export interface ThreadDetailsType {
  id: string;
  user_id: string;
  consultant_id: string;
  last_message_at: string;
  users: ConsultantUser;
}

export interface SessionType {
  id: string;
  user_id: string;
  consultant_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  user: {
    name: string;
    profile_image: string | null;
  };
}

export interface StoryTagType {
  type: 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
  label: string;
}

export interface Story {
  id: string;
  title: string;
  snippet: string;
  content: string;
  cover_image: string;
  tags: string[];
  tag_type: 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
  author_id: string;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    profile_image: string | null;
  };
  authorName?: string;
  authorImage?: string;
}
