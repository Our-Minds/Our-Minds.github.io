
export interface Story {
  id: string;
  title: string;
  snippet: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  tagType: 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
}

export const stories: Story[] = [
  {
    id: '1',
    title: 'Finding Light - My Story',
    snippet: "My journey through darkness to find meaning and purpose again.",
    content: `My name is Kelvin Juma, and for a long time, I didn't know how to explain what I was feeling. From the outside I probably looked fine—just another 17-year-old trying to get through school, crack a few jokes, and stay normal. But inside, everything changed. It was like a switch flipped. Waking up in the morning was the hardest part. I would lie in bed staring at the ceiling, asking myself what the point of getting up even was. The things that used to bring me joy—and even the things I used to love—football, drawing, visiting with my cousins—felt dull and distant. I was tired all the time, but I couldn't sleep. I knew I needed to talk to someone. I really did. But every time I tried, I either got told to "man up" or "snap out of it." So I stopped trying. I lost everything that once protected me—my routine, my friendships, my goals. After many days I finally just...`,
    authorId: '5',
    authorName: 'Kelvin Juma',
    authorImage: 'https://i.pravatar.cc/150?img=6',
    publishedAt: '2023-04-15T10:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1541971297127-c4e5a4438b3b',
    tags: ['depression', 'recovery', 'teen'],
    tagType: 'mental',
  },
  {
    id: '2',
    title: 'Mental Health affects all',
    snippet: "How I learned that mental health is universal and affects everyone.",
    content: "Mental health isn't just a concern for certain people—it's something that affects all of us, regardless of background, age, or circumstance. For years, I worked in healthcare without realizing the impact of mental health on physical outcomes. It wasn't until I experienced burnout myself that I truly understood how interconnected our mental and physical wellbeing really is...",
    authorId: '2',
    authorName: 'Ann Silo',
    authorImage: 'https://i.pravatar.cc/150?img=5',
    publishedAt: '2023-04-02T14:20:00Z',
    coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    tags: ['awareness', 'healthcare', 'universal'],
    tagType: 'mental',
  },
  {
    id: '3',
    title: 'How I control my thoughts',
    snippet: "Techniques I've learned to manage intrusive thoughts and anxiety.",
    content: "The mind can sometimes feel like an untamed beast, especially when anxiety or intrusive thoughts take over. Through years of practice, therapy, and self-discovery, I've developed techniques that help me regain control when my mind starts racing...",
    authorId: '5',
    authorName: 'Kelvin Juma',
    authorImage: 'https://i.pravatar.cc/150?img=6',
    publishedAt: '2023-03-25T09:15:00Z',
    coverImage: 'https://images.unsplash.com/photo-1542157585-ef20bfcce579',
    tags: ['anxiety', 'mindfulness', 'techniques'],
    tagType: 'control',
  },
  {
    id: '4',
    title: 'Drugs hurt your mind more',
    snippet: "My experience with substance abuse and its lasting effects on mental health.",
    content: "What started as occasional use quickly spiraled into dependency. I didn't realize how much the substances were affecting my mind until I was deep in a battle I wasn't prepared to fight. The chemical alterations to my brain chemistry made my existing mental health issues exponentially worse...",
    authorId: '6',
    authorName: 'Oscar Ben',
    authorImage: 'https://i.pravatar.cc/150?img=8',
    publishedAt: '2023-03-10T16:45:00Z',
    coverImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d',
    tags: ['addiction', 'recovery', 'substance abuse'],
    tagType: 'drugs',
  },
  {
    id: '5',
    title: 'How I designed my life',
    snippet: "Creating a life aligned with my mental health needs and personal values.",
    content: "After years of trying to fit into a lifestyle that wasn't working for me, I realized I needed to design my life intentionally around my mental health needs. This meant making difficult decisions about career, relationships, and daily habits...",
    authorId: '7',
    authorName: 'Maya Chen',
    authorImage: 'https://i.pravatar.cc/150?img=9',
    publishedAt: '2023-02-28T11:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57',
    tags: ['lifestyle', 'balance', 'wellness'],
    tagType: 'life',
  }
];
