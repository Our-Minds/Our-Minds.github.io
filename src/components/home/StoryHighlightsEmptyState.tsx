
import { Search, TrendingUp } from 'lucide-react';

interface StoryHighlightsEmptyStateProps {
  searchQuery: string;
}

export function StoryHighlightsEmptyState({ searchQuery }: StoryHighlightsEmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="relative mx-auto mb-6 w-20 h-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#21262d] dark:to-[#161b22] rounded-2xl"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          {searchQuery ? <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" /> : <TrendingUp className="w-10 h-10 text-gray-400 dark:text-gray-500" />}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {searchQuery ? 'No stories found' : 'No stories available'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
        {searchQuery 
          ? `No stories match your search for "${searchQuery}". Try different keywords or tags.`
          : 'Check back later for trending content from our amazing community of writers'
        }
      </p>
    </div>
  );
}
