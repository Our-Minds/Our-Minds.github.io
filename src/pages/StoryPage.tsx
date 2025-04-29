import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Story } from '@/utils/types';

export function StoryPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (!storyId) {
          navigate('/');
          return;
        }
        
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('id', storyId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Fetch author information
          let author = { name: 'Anonymous', profile_image: null };
          
          if (data.author_id) {
            const { data: authorData, error: authorError } = await supabase
              .from('users')
              .select('name, profile_image')
              .eq('id', data.author_id)
              .single();
            
            if (!authorError && authorData) {
              author = authorData;
            }
          }
          
          // Type casting to ensure the tag_type is properly typed
          const tagType = data.tag_type as 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
          
          const storyWithAuthor: Story = {
            ...data,
            tag_type: tagType,
            author: author
          };
          
          setStory(storyWithAuthor);
          
          // Update document title
          document.title = `${data.title} | Our Minds`;
        } else {
          navigate('/');
        }
      } catch (error: any) {
        console.error('Error fetching story:', error);
        toast({
          title: "Failed to load story",
          description: error.message || "Could not retrieve the story",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStory();
  }, [storyId, navigate, toast]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading story...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!story) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <p>Story not found</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className={`text-white text-sm py-1 px-3 rounded inline-block mb-2`} style={{backgroundColor: `var(--story-tag-${story.tag_type})`}}>
              {story.tags[0]}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={story.author?.profile_image} />
                <AvatarFallback>{story.author?.name.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{story.author?.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(story.published_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <img 
              src={story.cover_image} 
              alt={story.title} 
              className="w-full rounded-lg object-cover h-64 md:h-96"
              onError={(e) => {
                // Fallback image if the cover image fails to load
                (e.target as HTMLImageElement).src = '/public/lovable-uploads/7646df82-fc16-4ccb-8469-742a8722685b.png';
              }}
            />
          </div>
          
          <div className="prose prose-green max-w-none">
            {story.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StoryPage;
