
import { BookOpen, FilePlus } from 'lucide-react';
import { CreateStoryDialog } from '@/components/story/CreateStoryDialog';
import { Button } from '@/components/ui/button';

export function StoriesEmptyState() {
  return (
    <div className="text-center py-10 space-y-4">
      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
      <div>
        <h3 className="text-lg font-medium">No stories yet</h3>
        <p className="text-sm text-gray-500">
          Share your insights and experiences by creating your first story.
        </p>
      </div>
      <CreateStoryDialog>
        <Button className="mt-4">
          <FilePlus className="mr-2 h-4 w-4" />
          Create Your First Story
        </Button>
      </CreateStoryDialog>
    </div>
  );
}
