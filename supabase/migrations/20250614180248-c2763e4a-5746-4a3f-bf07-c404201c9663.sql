
-- Create comments table for Reddit-style commenting
CREATE TABLE public.story_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.story_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment votes table to track user votes
CREATE TABLE public.comment_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.story_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_story_comments_story_id ON public.story_comments(story_id);
CREATE INDEX idx_story_comments_parent_id ON public.story_comments(parent_comment_id);
CREATE INDEX idx_story_comments_created_at ON public.story_comments(created_at);
CREATE INDEX idx_comment_votes_comment_id ON public.comment_votes(comment_id);
CREATE INDEX idx_comment_votes_user_id ON public.comment_votes(user_id);

-- Enable RLS on both tables
ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for story_comments
CREATE POLICY "Anyone can view comments" ON public.story_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.story_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own comments" ON public.story_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.story_comments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for comment_votes
CREATE POLICY "Anyone can view comment votes" ON public.comment_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.comment_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own votes" ON public.comment_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.comment_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.story_comments 
    SET 
      upvotes = (
        SELECT COUNT(*) FROM public.comment_votes 
        WHERE comment_id = NEW.comment_id AND vote_type = 'upvote'
      ),
      downvotes = (
        SELECT COUNT(*) FROM public.comment_votes 
        WHERE comment_id = NEW.comment_id AND vote_type = 'downvote'
      )
    WHERE id = NEW.comment_id;
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE public.story_comments 
    SET 
      upvotes = (
        SELECT COUNT(*) FROM public.comment_votes 
        WHERE comment_id = OLD.comment_id AND vote_type = 'upvote'
      ),
      downvotes = (
        SELECT COUNT(*) FROM public.comment_votes 
        WHERE comment_id = OLD.comment_id AND vote_type = 'downvote'
      )
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update vote counts
CREATE TRIGGER update_comment_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION update_comment_vote_counts();

-- Add updated_at trigger for comments
CREATE TRIGGER update_story_comments_updated_at
  BEFORE UPDATE ON public.story_comments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Enable realtime for comments
ALTER TABLE public.story_comments REPLICA IDENTITY FULL;
ALTER TABLE public.comment_votes REPLICA IDENTITY FULL;
