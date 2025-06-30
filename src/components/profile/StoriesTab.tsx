
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateStoryDialog } from '@/components/story/CreateStoryDialog';
import { Story } from '@/utils/consultantTypes';
import { useUserStories } from '@/hooks/useUserStories';
import { StoryCard } from './StoryCard';
import { StoriesEmptyState } from './StoriesEmptyState';

export function StoriesTab() {
  const { stories, isLoading, handleDeleteStory } = useUserStories();
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  
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
            <StoriesEmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onEdit={setEditingStory}
                  onDelete={handleDeleteStory}
                />
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
