
import React from 'react';
import { Button } from '@/components/ui/button';
import { useStoriesModeration, useToggleStoryFeature } from '@/hooks/useAdminData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, StarOff, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export const ContentManagementTab = () => {
  const { data: stories, isLoading, error } = useStoriesModeration();
  const toggleFeature = useToggleStoryFeature();

  const handleToggleFeature = (storyId: string, isFeatured: boolean) => {
    toggleFeature.mutate({ storyId, isFeatured: !isFeatured });
  };

  const truncate = (text: string, length = 50) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Content Management</h3>
        <Button size="sm">
          Add Content
        </Button>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p>Failed to load content</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        ) : stories && stories.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Snippet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>{truncate(story.title, 30)}</TableCell>
                  <TableCell>{truncate(story.snippet || '', 50)}</TableCell>
                  <TableCell>
                    <Badge variant={story.status === 'published' ? 'default' : 'outline'}>
                      {story.status || 'published'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(story.published_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={story.is_featured ? 'secondary' : 'outline'}>
                      {story.is_featured ? 'Featured' : 'Not featured'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleToggleFeature(story.id, story.is_featured)}
                      >
                        {story.is_featured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p>No stories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementTab;
