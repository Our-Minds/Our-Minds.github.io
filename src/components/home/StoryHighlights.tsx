
import { useState, useMemo } from 'react';
import { Story } from '@/utils/consultantTypes';
import { StoryHighlightsHeader } from './StoryHighlightsHeader';
import { StoryCard } from './StoryCard';
import { StoryHighlightsEmptyState } from './StoryHighlightsEmptyState';
import { StoryHighlightsLoadingSkeleton } from './StoryHighlightsLoadingSkeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface StoryHighlightsProps {
  stories: Story[];
  isLoading: boolean;
}

export function StoryHighlights({ stories, isLoading }: StoryHighlightsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  // Filter stories based on search query
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return stories;
    
    const query = searchQuery.toLowerCase();
    return stories.filter(story => 
      story.title.toLowerCase().includes(query) ||
      story.content.toLowerCase().includes(query) ||
      story.tags.some(tag => tag.toLowerCase().includes(query)) ||
      story.tag_type.toLowerCase().includes(query) ||
      (story.authorName && story.authorName.toLowerCase().includes(query))
    );
  }, [stories, searchQuery]);
  
  if (isLoading) {
    return <StoryHighlightsLoadingSkeleton />;
  }

  return (
    <div className={`
      bg-gray-100 dark:bg-[#212121] border border-gray-200 dark:border-[#3a3a3a]
      ${isMobile ? 'rounded-t-3xl border-b-0 shadow-sm min-h-screen' : 'h-full'} 
      flex flex-col
    `}>
      <StoryHighlightsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={filteredStories.length}
      />
      
      {/* Stories List */}
      <div className={`
        flex-1 overflow-y-auto
        ${isMobile ? 'p-4 pb-24' : 'p-6'} 
      `}>
        {filteredStories.length > 0 ? (
          <div className="space-y-4 lg:space-y-6">
            {filteredStories.map((story, index) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={index} 
                isSearching={!!searchQuery}
              />
            ))}
          </div>
        ) : (
          <StoryHighlightsEmptyState searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

export default StoryHighlights;
