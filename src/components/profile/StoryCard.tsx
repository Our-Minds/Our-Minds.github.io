
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Story } from '@/utils/consultantTypes';

interface StoryCardProps {
  story: Story;
  onEdit: (story: Story) => void;
  onDelete: (storyId: string) => void;
}

export function StoryCard({ story, onEdit, onDelete }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="overflow-hidden border">
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
            onClick={() => onEdit(story)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(story.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
