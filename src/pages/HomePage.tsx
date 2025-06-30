
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import FeaturedStory from '@/components/home/FeaturedStory';
import StoryHighlights from '@/components/home/StoryHighlights';
import { ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Story } from '@/utils/consultantTypes';
import { useIsMobile } from '@/hooks/use-mobile';

export function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);

        const { data: storiesData, error: storiesError } = await supabase
          .from('stories_with_authors')
          .select('*')
          .order('published_at', { ascending: false });

        if (storiesError) {
          throw storiesError;
        }

        if (storiesData) {
          const formattedStories: Story[] = storiesData.map((story: any) => ({
            id: story.id,
            title: story.title,
            snippet: story.snippet,
            content: story.content,
            cover_image: story.cover_image || '/placeholder.svg',
            tags: story.tags || [],
            tag_type: story.tag_type || 'mental',
            author_id: story.author_id,
            is_featured: story.is_featured || false,
            published_at: story.published_at,
            created_at: story.created_at,
            updated_at: story.updated_at,
            authorName: story.author_name,
            authorImage: story.author_image,
            author: {
              name: story.author_name || 'Anonymous',
              profile_image: story.author_image,
            },
          }));

          setStories(formattedStories);
        }
      } catch (error: any) {
        console.error('Error fetching stories:', error);
        toast({
          title: 'Failed to load stories',
          description: error.message || 'Could not retrieve stories from the database',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [toast]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout showSidebar={true}>
      <div className="w-full h-full bg-white dark:bg-[#212121]">
        {isMobile ? (
          // Mobile: Stacked layout
          <div className="flex flex-col h-full">
            <div className="w-full border-b border-gray-200 dark:border-[#3a3a3a]">
              <div className="p-4">
                {isLoading ? (
                  <FeaturedStory stories={stories} isLoading={true} />
                ) : (
                  <FeaturedStory
                    stories={stories.map((story) => ({
                      ...story,
                      linkWrapper: (children: React.ReactNode) => (
                        <Link to={`/story/${story.id}`}>{children}</Link>
                      ),
                    }))}
                    isLoading={false}
                  />
                )}
              </div>
            </div>
            
            <div className="flex-1 pb-20">
              {isLoading ? (
                <StoryHighlights stories={stories} isLoading={true} />
              ) : (
                <StoryHighlights
                  stories={stories.map((story) => ({
                    ...story,
                    linkWrapper: (children: React.ReactNode) => (
                      <Link to={`/story/${story.id}`}>{children}</Link>
                    ),
                  }))}
                  isLoading={false}
                />
              )}
            </div>
          </div>
        ) : (
          // Desktop: Side-by-side layout with clear boundaries
          <div className="flex h-[calc(100vh-3.5rem)] w-full">
            {/* Left Panel - Featured Story with exact width and border */}
            <div className="w-1/2 h-full border-r-2 border-gray-300 dark:border-[#3a3a3a] overflow-hidden">
              <div className="h-full p-6 overflow-y-auto bg-white dark:bg-[#212121]">
                {isLoading ? (
                  <FeaturedStory stories={stories} isLoading={true} />
                ) : (
                  <FeaturedStory
                    stories={stories.map((story) => ({
                      ...story,
                      linkWrapper: (children: React.ReactNode) => (
                        <Link to={`/story/${story.id}`}>{children}</Link>
                      ),
                    }))}
                    isLoading={false}
                  />
                )}
              </div>
            </div>

            {/* Right Panel - Story Highlights with exact width */}
            <div className="w-1/2 h-full overflow-hidden">
              {isLoading ? (
                <StoryHighlights stories={stories} isLoading={true} />
              ) : (
                <StoryHighlights
                  stories={stories.map((story) => ({
                    ...story,
                    linkWrapper: (children: React.ReactNode) => (
                      <Link to={`/story/${story.id}`}>{children}</Link>
                    ),
                  }))}
                  isLoading={false}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-[#025803] text-white shadow-lg hover:bg-[#014502] transition-colors z-40"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </Layout>
  );
}

export default HomePage;
