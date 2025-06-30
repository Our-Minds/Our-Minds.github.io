
import { Input } from '@/components/ui/input';
import { Search, TrendingUp } from 'lucide-react';

interface StoryHighlightsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
}

export function StoryHighlightsHeader({ 
  searchQuery, 
  setSearchQuery, 
  resultCount 
}: StoryHighlightsHeaderProps) {
  return (
    <div className="sticky top-0 z-10 p-3 border-b border-gray-200 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a] flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className="p-1.5 bg-gradient-to-br from-[#025803]/10 to-[#025803]/20 dark:from-[#025803]/20 dark:to-[#025803]/30 rounded-lg">
          <TrendingUp className="w-4 h-4 text-[#025803] dark:text-[#037004]" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate">Trending Stories</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">Discover engaging content from our community</p>
        </div>
      </div>
      
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-3.5 h-3.5" />
        <Input
          type="text"
          placeholder="Search by title, content, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm bg-gray-50 dark:bg-[#3a3a3a] border-gray-200 dark:border-[#4a4a4a] focus:bg-white dark:focus:bg-[#2a2a2a] focus:border-[#025803] dark:focus:border-[#037004] transition-colors text-gray-900 dark:text-gray-100"
        />
      </div>
      
      {searchQuery && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Found {resultCount} result{resultCount !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      )}
    </div>
  );
}
