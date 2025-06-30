
export interface Comment {
  id: string;
  story_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    profile_image: string | null;
  };
  replies?: Comment[];
  user_vote?: 'upvote' | 'downvote' | null;
}

export interface CommentVote {
  id: string;
  comment_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
}
