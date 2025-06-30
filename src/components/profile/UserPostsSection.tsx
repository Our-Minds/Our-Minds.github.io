import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { BookOpen, Calendar } from 'lucide-react';

interface UserPost {
  id: string;
  title: string;
  snippet: string;
  cover_image: string;
  tags: string[];
  tag_type: 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
  published_at: string;
  is_featured: boolean;
}

interface UserPostsSectionProps {
  userId: string;
  userName: string;
}

export function UserPostsSection({ userId, userName }: UserPostsSectionProps) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: async (): Promise<UserPost[]> => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, snippet, cover_image, tags, tag_type, published_at, is_featured')
        .eq('author_id', userId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      // Type-safe transformation
      return (data || []).map(story => ({
        id: story.id,
        title: story.title,
        snippet: story.snippet,
        cover_image: story.cover_image,
        tags: story.tags,
        tag_type: story.tag_type as 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression',
        published_at: story.published_at,
        is_featured: story.is_featured
      }));
    },
    enabled: !!userId,
  });

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const tagColorMap: Record<string, string> = {
    mental: 'bg-blue-100 text-blue-800',
    control: 'bg-purple-100 text-purple-800',
    drugs: 'bg-red-100 text-red-800',
    life: 'bg-green-100 text-green-800',
    anxiety: 'bg-yellow-100 text-yellow-800',
    depression: 'bg-gray-100 text-gray-800'
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Posts by {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading posts...</div>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Posts by {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No posts published yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen size={20} />
          Posts by {userName} ({posts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/story/${post.id}`}
              className="group block"
            >
              <Card className="overflow-hidden transition-all hover:shadow-md border">
                <div className="aspect-video relative">
                  <img
                    src={post.cover_image || '/placeholder.svg'}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {post.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-mental-green-600">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={tagColorMap[post.tag_type] || 'bg-gray-100 text-gray-800'}
                    >
                      {post.tags[0] || post.tag_type}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-mental-green-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {post.snippet}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default UserPostsSection;
