
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '@/utils/consultantTypes';
import { StoryCard } from './StoryCard';
import { Button } from '@/components/ui/button';

// Convert mock stories to the correct format
const mockStories: Story[] = [
  {
    id: '1',
    title: 'Finding Light - My Story',
    snippet: "My journey through darkness to find meaning and purpose again.",
    content: `My name is Kelvin Juma, and for a long time, I didn't know how to explain what I was feeling. From the outside I probably looked fine—just another 17-year-old trying to get through school, crack a few jokes, and stay normal. But inside, everything changed. It was like a switch flipped. Waking up in the morning was the hardest part. I would lie in bed staring at the ceiling, asking myself what the point of getting up even was. The things that used to bring me joy—and even the things I used to love—football, drawing, visiting with my cousins—felt dull and distant. I was tired all the time, but I couldn't sleep. I knew I needed to talk to someone. I really did. But every time I tried, I either got told to "man up" or "snap out of it." So I stopped trying. I lost everything that once protected me—my routine, my friendships, my goals. After many days I finally just...`,
    cover_image: 'https://images.unsplash.com/photo-1541971297127-c4e5a4438b3b',
    author_id: '5',
    authorName: 'Kelvin Juma',
    authorImage: 'https://i.pravatar.cc/150?img=6',
    published_at: '2023-04-15T10:30:00Z',
    created_at: '2023-04-15T10:30:00Z',
    updated_at: '2023-04-15T10:30:00Z',
    tags: ['depression', 'recovery', 'teen'],
    tag_type: 'mental',
    is_featured: true,
    author: {
      name: 'Kelvin Juma',
      profile_image: 'https://i.pravatar.cc/150?img=6',
    },
  },
  {
    id: '2',
    title: 'Mental Health affects all',
    snippet: "How I learned that mental health is universal and affects everyone.",
    content: "Mental health isn't just a concern for certain people—it's something that affects all of us, regardless of background, age, or circumstance. For years, I worked in healthcare without realizing the impact of mental health on physical outcomes. It wasn't until I experienced burnout myself that I truly understood how interconnected our mental and physical wellbeing really is...",
    cover_image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    author_id: '2',
    authorName: 'Ann Silo',
    authorImage: 'https://i.pravatar.cc/150?img=5',
    published_at: '2023-04-02T14:20:00Z',
    created_at: '2023-04-02T14:20:00Z',
    updated_at: '2023-04-02T14:20:00Z',
    tags: ['awareness', 'healthcare', 'universal'],
    tag_type: 'mental',
    is_featured: false,
    author: {
      name: 'Ann Silo',
      profile_image: 'https://i.pravatar.cc/150?img=5',
    },
  },
  {
    id: '3',
    title: 'How I control my thoughts',
    snippet: "Techniques I've learned to manage intrusive thoughts and anxiety.",
    content: "The mind can sometimes feel like an untamed beast, especially when anxiety or intrusive thoughts take over. Through years of practice, therapy, and self-discovery, I've developed techniques that help me regain control when my mind starts racing...",
    cover_image: 'https://images.unsplash.com/photo-1542157585-ef20bfcce579',
    author_id: '5',
    authorName: 'Kelvin Juma',
    authorImage: 'https://i.pravatar.cc/150?img=6',
    published_at: '2023-03-25T09:15:00Z',
    created_at: '2023-03-25T09:15:00Z',
    updated_at: '2023-03-25T09:15:00Z',
    tags: ['anxiety', 'mindfulness', 'techniques'],
    tag_type: 'control',
    is_featured: false,
    author: {
      name: 'Kelvin Juma',
      profile_image: 'https://i.pravatar.cc/150?img=6',
    },
  },
  {
    id: '4',
    title: 'Drugs hurt your mind more',
    snippet: "My experience with substance abuse and its lasting effects on mental health.",
    content: "What started as occasional use quickly spiraled into dependency. I didn't realize how much the substances were affecting my mind until I was deep in a battle I wasn't prepared to fight. The chemical alterations to my brain chemistry made my existing mental health issues exponentially worse...",
    cover_image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d',
    author_id: '6',
    authorName: 'Oscar Ben',
    authorImage: 'https://i.pravatar.cc/150?img=8',
    published_at: '2023-03-10T16:45:00Z',
    created_at: '2023-03-10T16:45:00Z',
    updated_at: '2023-03-10T16:45:00Z',
    tags: ['addiction', 'recovery', 'substance abuse'],
    tag_type: 'drugs',
    is_featured: false,
    author: {
      name: 'Oscar Ben',
      profile_image: 'https://i.pravatar.cc/150?img=8',
    },
  },
];

export function TopStories() {
  const [page, setPage] = useState(0);
  const storiesPerPage = 4;
  const totalPages = Math.ceil(mockStories.length / storiesPerPage);
  
  const paginatedStories = mockStories.slice(
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
          {paginatedStories.slice(0, 1).map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} isSearching={false} />
          ))}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1">
            {paginatedStories.slice(1).map((story, index) => (
              <StoryCard key={story.id} story={story} index={index + 1} isSearching={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopStories;
