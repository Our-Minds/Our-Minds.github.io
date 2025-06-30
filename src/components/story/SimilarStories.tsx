
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/utils/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, TrendingUp } from 'lucide-react';

interface SimilarStoriesProps {
  currentStory: Story;
}

export function SimilarStories({ currentStory }: SimilarStoriesProps) {
  const [similarStories, setSimilarStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarStories = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('tag_type', currentStory.tag_type)
          .neq('id', currentStory.id)
          .limit(5);

        if (error) throw error;

        const storiesWithAuthors: Story[] = (data || []).map(story => {
          const tagType = story.tag_type as 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
          
          return {
            ...story,
            tag_type: tagType,
            author: {
              name: 'Anonymous',
              profile_image: null
            }
          };
        });

        setSimilarStories(storiesWithAuthors);
      } catch (error) {
        console.error('Error fetching similar stories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarStories();
  }, [currentStory.tag_type, currentStory.id]);

  if (isLoading) {
    return (
      <div className="p-3">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarStories.length === 0) {
    return (
      <div className="p-4 text-center">
        <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-sm">No similar stories found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {similarStories.map((story, index) => (
          <Link
            key={story.id}
            to={`/story/${story.id}`}
            className="block group"
          >
            <div className="p-3 rounded-lg border border-border hover:border-[#037004] hover:bg-accent transition-all duration-200 group-hover:shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={story.author?.profile_image || undefined} />
                    <AvatarFallback className="bg-[#037004] text-white text-xs">
                      {(story.author?.name || 'A').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-[#037004] transition-colors mb-1">
                    {story.title}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {story.snippet}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{story.author?.name || 'Anonymous'}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>{formatDistanceToNow(new Date(story.published_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <span 
                      className="text-white text-xs py-0.5 px-2 rounded-full font-medium flex-shrink-0 bg-[#037004]"
                    >
                      {story.tags[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
