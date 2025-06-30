
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Heart } from 'lucide-react';
import { Story } from '@/utils/types';
import { useStoryLikes } from '@/hooks/useStoryLikes';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface StoryContentProps {
  story: Story;
}

export function StoryContent({ story }: StoryContentProps) {
  const readingTime = Math.ceil(story.content.split(' ').length / 200);
  const { likesCount, isLiked, isLoading, toggleLike } = useStoryLikes(story.id);
  const isMobile = useIsMobile();

  // Define better color combinations for each tag type
  const getTagColors = (tagType: string) => {
    switch (tagType) {
      case 'mental':
        return 'bg-[#037004] text-white border-[#025803]';
      case 'control':
        return 'bg-blue-500 text-white border-blue-600';
      case 'drugs':
        return 'bg-red-500 text-white border-red-600';
      case 'life':
        return 'bg-orange-500 text-white border-orange-600';
      case 'anxiety':
        return 'bg-purple-500 text-white border-purple-600';
      case 'depression':
        return 'bg-indigo-500 text-white border-indigo-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Story Header - More mobile-friendly */}
      <div className={`${isMobile ? 'p-3' : 'p-4 sm:p-6'} border-b border-border bg-card flex-shrink-0`}>
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div 
              className={`text-xs py-1.5 px-3 rounded-full font-medium shadow-sm w-fit ${getTagColors(story.tag_type)}`}
            >
              {story.tags[0]}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock size={12} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>

        <h1 className={`font-bold text-foreground mb-4 leading-tight ${
          isMobile ? 'text-lg' : 'text-xl sm:text-2xl lg:text-3xl'
        }`}>
          {story.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className={`ring-1 ring-[#037004] ${isMobile ? 'h-8 w-8' : 'h-9 w-9'}`}>
              <AvatarImage src={story.author?.profile_image || undefined} />
              <AvatarFallback className="bg-[#037004] text-white font-semibold text-sm">
                {(story.author?.name || 'A').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-semibold text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                {story.author?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-muted-foreground">
                Published {formatDistanceToNow(new Date(story.published_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleLike}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors",
                "hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed",
                isLiked 
                  ? "text-red-500 bg-red-500/10" 
                  : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart 
                size={14} 
                className={cn(
                  "transition-all",
                  isLiked ? "fill-current" : ""
                )}
              />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Story Content - Scrollable with better mobile spacing */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className={`${isMobile ? 'p-3' : 'p-4 sm:p-6'}`}>
          {/* Cover Image - Better mobile sizing */}
          <div className="mb-6">
            <img
              src={story.cover_image}
              alt={story.title}
              className={`w-full rounded-lg object-cover shadow-sm border border-border ${
                isMobile ? 'h-40' : 'h-48 sm:h-64 lg:h-80'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Story Text with better mobile typography */}
          <div className="prose prose-base lg:prose-lg max-w-none">
            <div className={`text-foreground leading-relaxed space-y-4 ${isMobile ? 'space-y-3' : 'space-y-6'}`}>
              {story.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className={`text-foreground ${
                  isMobile ? 'text-sm leading-6' : 'text-base lg:text-lg leading-7 lg:leading-8'
                }`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Story Tags - Better mobile layout */}
          <div className={`mt-6 pt-4 border-t border-border ${isMobile ? 'mt-4' : 'mt-8 pt-6'}`}>
            <h3 className={`font-semibold mb-3 text-foreground ${isMobile ? 'text-base' : 'text-lg mb-4'}`}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 bg-[#037004]/20 text-[#037004] dark:text-[#4ade80] rounded-full font-medium hover:bg-[#037004]/30 transition-colors cursor-pointer border border-[#037004]/30 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
