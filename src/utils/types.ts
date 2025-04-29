
export interface Story {
  id: string;
  title: string;
  snippet: string;
  content: string;
  cover_image: string;
  author_id: string | null;
  authorName?: string;
  authorImage?: string;
  published_at: string;
  tags: string[];
  tag_type: 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  author?: {
    name: string;
    profile_image: string;
  };
}
