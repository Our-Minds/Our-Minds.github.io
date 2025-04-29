import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Story } from '@/utils/types';

interface StoryHighlightsProps {
  stories: Story[];
  isLoading: boolean;
}

export function StoryHighlights({ stories, isLoading }: StoryHighlightsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 h-full">
        <Skeleton className="h-8 w-40 mb-4" />
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex items-center">
                <Skeleton className="w-24 h-24" />
                
                <div className="flex-1 p-3">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-6 w-40 mb-2" />
                  
                  <div className="flex items-center mt-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-20 h-4 ml-2" />
                    <Skeleton className="w-10 h-4 ml-auto" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Top Stories</h2>
      
      <div className="space-y-4">
        {stories.length > 0 ? (
          stories.map((story) => (
            <Link key={story.id} to={`/story/${story.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-24 h-24">
                    <img 
                      src={story.cover_image} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image if the cover image fails to load
                        (e.target as HTMLImageElement).src = '/public/lovable-uploads/7646df82-fc16-4ccb-8469-742a8722685b.png';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 p-3">
                    <div className={`text-white text-xs py-0.5 px-2 rounded inline-block mb-1`} style={{backgroundColor: `var(--story-tag-${story.tag_type})`}}>
                      {story.tags[0]}
                    </div>
                    
                    <h3 className="font-medium text-sm">{story.title}</h3>
                    
                    <div className="flex items-center mt-2">
                      <img 
                        src={story.authorImage || story.author?.profile_image} 
                        alt={story.authorName || story.author?.name || 'Anonymous'} 
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback image if the author image fails to load
                          (e.target as HTMLImageElement).src = '/public/lovable-uploads/7646df82-fc16-4ccb-8469-742a8722685b.png';
                        }}
                      />
                      <span className="text-xs ml-2 text-gray-600">{story.authorName || story.author?.name || 'Anonymous'}</span>
                      <span className="text-xs ml-auto text-gray-500">
                        {formatDistanceToNow(new Date(story.published_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No stories available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryHighlights;
