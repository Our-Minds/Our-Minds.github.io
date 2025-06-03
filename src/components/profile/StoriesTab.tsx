
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Edit, Trash2, BookOpen, FilePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CreateStoryDialog } from '@/components/story/CreateStoryDialog';
import { Link } from 'react-router-dom';
import { Story } from '@/utils/consultantTypes';

export function StoriesTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  
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
  
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const renderCreateStoryButton = () => (
    <Button className="mt-4">
      <FilePlus className="mr-2 h-4 w-4" />
      Create Your First Story
    </Button>
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Stories</CardTitle>
            <CardDescription>
              Manage stories you've shared on the platform.
            </CardDescription>
          </div>
          <CreateStoryDialog />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <p>Loading your stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-10 space-y-4">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium">No stories yet</h3>
                <p className="text-sm text-gray-500">
                  Share your insights and experiences by creating your first story.
                </p>
              </div>
              <CreateStoryDialog>
                {renderCreateStoryButton()}
              </CreateStoryDialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map(story => (
                <Card key={story.id} className="overflow-hidden border">
                  <div className="aspect-video relative">
                    <img
                      src={story.cover_image || '/placeholder.svg'}
                      alt={story.title}
                      className="object-cover w-full h-full"
                    />
                    {story.is_featured && (
                      <Badge className="absolute top-2 right-2 bg-mental-green-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{story.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Published on {formatDate(story.published_at)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {story.snippet}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {story.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {story.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{story.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between pt-2">
                    <Link to={`/story/${story.id}`}>
                      <Button variant="outline" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" /> Read
                      </Button>
                    </Link>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingStory(story);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {editingStory && (
        <CreateStoryDialog story={editingStory} onOpenChange={() => setEditingStory(null)} />
      )}
    </div>
  );
}

export default StoriesTab;
