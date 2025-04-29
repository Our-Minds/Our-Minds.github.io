import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Story } from '@/data/mockStories';

interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'featured';
}

export function StoryCard({ story, variant = 'default' }: StoryCardProps) {
  const isFeatured = variant === 'featured';
  
  const tagColorMap: Record<string, string> = {
    mental: 'bg-story-tag-mental',
    control: 'bg-story-tag-control',
    drugs: 'bg-story-tag-drugs',
    life: 'bg-story-tag-life',
    anxiety: 'bg-story-tag-anxiety',
    depression: 'bg-story-tag-depression'
  };
  
  return (
    <Link
      to={`/story/${story.id}`}
      className={cn(
        'group overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md',
        isFeatured ? 'flex md:flex-row flex-col' : 'flex flex-col'
      )}
    >
      <div 
        className={cn(
          'overflow-hidden bg-gray-100',
          isFeatured ? 'md:w-1/2 w-full md:h-auto aspect-[16/9]' : 'w-full aspect-[16/9]'
        )}
      >
        <img
          src={story.coverImage}
          alt={story.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className={cn('flex flex-col p-4', isFeatured && 'md:w-1/2')}>
        <div className={cn('mb-2', tagColorMap[story.tagType])}>
          <span className="story-tag">{story.tags[0]}</span>
        </div>
        
        <h3 className={cn('mb-2 font-bold leading-tight', isFeatured ? 'text-xl' : 'text-lg')}>
          {story.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {story.snippet}
        </p>
        
        <div className="mt-auto flex items-center">
          <img
            src={story.authorImage}
            alt={story.authorName}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="ml-2">
            <p className="text-sm font-medium">{story.authorName}</p>
            <p className="text-xs text-gray-500">
              {new Date(story.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StoryCard;
