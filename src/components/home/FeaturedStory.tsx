
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Story } from '@/utils/types';
import { Star, Clock, User, TrendingUp, Sparkles } from 'lucide-react';

interface FeaturedStoryProps {
  stories: Story[];
  isLoading: boolean;
}

export function FeaturedStory({ stories, isLoading }: FeaturedStoryProps) {
  // Select the first featured story, or fallback to the first story
  const featuredStory = stories.find(story => story.is_featured) || stories[0];

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-3xl shadow-2xl h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#161b22] dark:to-[#21262d]">
        <div className="relative h-3/5">
          <Skeleton className="w-full h-full rounded-t-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#025803]/80 via-[#025803]/50 to-transparent" />
        </div>
        <div className="p-4 lg:p-6 h-2/5 bg-white dark:bg-[#161b22]">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex items-center mt-auto">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredStory) {
    return (
      <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#161b22] dark:to-[#21262d] h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-[#30363d] rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">No featured stories available</p>
        </div>
      </div>
    );
  }

  // Helper to truncate content without cutting words
  const truncateContent = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  const readingTime = Math.ceil(featuredStory.content.split(' ').length / 200);

  return (
    <Link to={`/story/${featuredStory.id}`} className="block h-full group">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl h-full bg-white dark:bg-[#161b22] group-hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2">
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#025803] to-[#037004] text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">Featured</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/90 dark:bg-[#21262d]/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Sparkles className="w-5 h-5 text-[#025803]" />
          </div>
        </div>

        {/* Hero Image Section - 60% height */}
        <div className="relative h-3/5 overflow-hidden">
          <img
            src={featuredStory.cover_image}
            alt={featuredStory.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#025803]/90 via-[#025803]/40 to-transparent" />
          
          {/* Story metadata overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-medium">
                  {featuredStory.tags[0]}
                </span>
              </div>
              
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">
                  {readingTime} min read
                </span>
              </div>
            </div>
            
            <h1 className="text-white text-xl lg:text-2xl xl:text-3xl font-bold leading-tight mb-2 line-clamp-2">
              {featuredStory.title}
            </h1>
            
            <p className="text-green-100 text-sm lg:text-base line-clamp-2 leading-relaxed">
              {featuredStory.snippet}
            </p>
          </div>
        </div>

        {/* Content Section - 40% height */}
        <div className="h-2/5 bg-gradient-to-br from-white to-gray-50 dark:from-[#161b22] dark:to-[#21262d] p-4 lg:p-6 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-[#025803] to-[#037004] rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-[#025803] text-lg font-bold">Top Story</h2>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base leading-relaxed line-clamp-3 mb-4">
              {truncateContent(featuredStory.content, 180)}
            </p>
          </div>

          {/* Enhanced Author Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#30363d]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-gray-200 dark:ring-[#30363d] shadow-md">
                  <AvatarImage src={featuredStory.authorImage} />
                  <AvatarFallback className="bg-gray-100 dark:bg-[#21262d] text-gray-700 dark:text-gray-300">
                    {(featuredStory.authorName || 'Anonymous').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#025803] border-2 border-white dark:border-[#161b22] rounded-full flex items-center justify-center">
                  <User className="w-2 h-2 text-white" />
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                  {featuredStory.authorName || 'Anonymous'}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Author</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(featuredStory.published_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[#025803] text-sm font-medium">
                Read Story
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Trending #1
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#025803]/0 to-[#025803]/0 group-hover:from-[#025803]/5 group-hover:to-transparent transition-all duration-500 rounded-3xl pointer-events-none" />
      </div>
    </Link>
  );
}

export default FeaturedStory;
