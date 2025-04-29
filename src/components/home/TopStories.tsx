
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { stories } from '@/data/mockStories';
import StoryCard from './StoryCard';
import { Button } from '@/components/ui/button';

export function TopStories() {
  const [page, setPage] = useState(0);
  const storiesPerPage = 4;
  const totalPages = Math.ceil(stories.length / storiesPerPage);
  
  const paginatedStories = stories.slice(
    page * storiesPerPage,
    (page + 1) * storiesPerPage
  );
  
  const nextPage = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };
  
  return (
    <section className="py-8">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-mental-green-800">Top Stories</h2>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevPage}
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextPage}
              disabled={totalPages <= 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {paginatedStories.slice(0, 1).map((story) => (
            <StoryCard key={story.id} story={story} variant="featured" />
          ))}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1">
            {paginatedStories.slice(1).map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopStories;
