
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useStoryLikes(storyId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch likes count and user's like status
  const fetchLikes = async () => {
    try {
      // Get total likes count
      const { data: likesData, error: likesError } = await supabase
        .from('story_likes')
        .select('id')
        .eq('story_id', storyId);

      if (likesError) throw likesError;
      setLikesCount(likesData?.length || 0);

      // Check if current user has liked this story
      if (user) {
        const { data: userLikeData, error: userLikeError } = await supabase
          .from('story_likes')
          .select('id')
          .eq('story_id', storyId)
          .eq('user_id', user.id)
          .single();

        if (userLikeError && userLikeError.code !== 'PGRST116') {
          throw userLikeError;
        }

        setIsLiked(!!userLikeData);
      }
    } catch (error: any) {
      console.error('Error fetching likes:', error);
    }
  };

  // Toggle like status
  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like stories",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike the story
        const { error } = await supabase
          .from('story_likes')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like the story
        const { error } = await supabase
          .from('story_likes')
          .insert({
            story_id: storyId,
            user_id: user.id
          });

        if (error) throw error;

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [storyId, user]);

  return {
    likesCount,
    isLiked,
    isLoading,
    toggleLike
  };
}
