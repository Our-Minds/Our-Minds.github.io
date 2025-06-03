import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import FeaturedStory from '@/components/home/FeaturedStory';
import StoryHighlights from '@/components/home/StoryHighlights';
import { ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Story } from '@/utils/consultantTypes';

export function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const { toast } = useToast();

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
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-1/2 p-4 h-full">
          <div className="h-[calc(100vh-8rem)]">
            {/* Wrap FeaturedStory with links to /story/:id */}
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

        <div className="w-full lg:w-1/2 p-4 h-full">
          <div className="h-[calc(100vh-8rem)] overflow-y-auto">
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
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-mental-green-600 text-white shadow-lg hover:bg-mental-green-700 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </Layout>
  );
}

export default HomePage;
