
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/utils/consultantTypes';

export function useUserStories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);
  
  const fetchStories = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', user.id)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match Story type
      const typedStories: Story[] = data ? data.map((story: any) => ({
        id: story.id,
        title: story.title,
        snippet: story.snippet,
        content: story.content,
        cover_image: story.cover_image,
        tags: story.tags,
        tag_type: story.tag_type || 'mental',
        author_id: story.author_id,
        is_featured: story.is_featured,
        published_at: story.published_at,
        created_at: story.created_at,
        updated_at: story.updated_at
      })) : [];
      
      setStories(typedStories);
    } catch (error: any) {
      toast({
        title: "Error fetching stories",
        description: error.message || "Could not load your stories.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('author_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setStories(prev => prev.filter(story => story.id !== storyId));
      
      toast({
        title: "Story deleted",
        description: "Your story has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting story",
        description: error.message || "Could not delete your story.",
        variant: "destructive"
      });
    }
  };

  return {
    stories,
    isLoading,
    handleDeleteStory,
    refetchStories: fetchStories
  };
}
