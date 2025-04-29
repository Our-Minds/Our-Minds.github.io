import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import FeaturedStory from '@/components/home/FeaturedStory';
import StoryHighlights from '@/components/home/StoryHighlights';
import { ArrowUp } from 'lucide-react';
import CreateStoryDialog from '@/components/story/CreateStoryDialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Story } from '@/utils/types';

export function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data: storiesData, error: storiesError } = await supabase
          .from('stories_with_authors')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (storiesError) {
          throw storiesError;
        }
        
        if (storiesData) {
          setStories(storiesData as Story[]);
        }
      } catch (error: any) {
        console.error('Error fetching stories:', error);
        toast({
          title: "Failed to load stories",
          description: error.message || "Could not retrieve stories from the database",
          variant: "destructive"
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
            <FeaturedStory stories={stories} isLoading={isLoading} />
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            {isAuthenticated && <CreateStoryDialog />}
          </div>
          <div className="h-[calc(100vh-8rem)] overflow-y-auto">
            <StoryHighlights stories={stories} isLoading={isLoading} />
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
