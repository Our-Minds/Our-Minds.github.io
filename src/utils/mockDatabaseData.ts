
/**
 * This file contains mock database data that can be used to seed the Supabase database
 * or for testing purposes.
 */

import { Users, Consultants, Stories, ChatThreads, ChatMessages, Transactions } from './dbSchema';

/**
 * Demo users for quick access
 */
export const demoUsers: Partial<Users>[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Test User',
    role: 'user',
    profile_image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    email: 'consultant@example.com',
    name: 'Ann Silo',
    role: 'consultant',
    profile_image: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    profile_image: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    email: 'owner@example.com',
    name: 'Owner User',
    role: 'owner',
    profile_image: 'https://i.pravatar.cc/150?img=4',
  }
];

/**
 * Demo consultants data
 */
export const demoConsultants: Partial<Consultants>[] = [
  {
    id: '2', // Same ID as Ann Silo user
    specialization: ['Anxiety', 'Depression', 'PTSD', 'Stress Management', 'Trauma', 'Grief'],
    languages: ['English', 'Spanish'],
    location: 'New York, USA',
    bio: 'Experienced mental health consultant with 10+ years of practice.',
    rating: 4.8,
    review_count: 124,
    hourly_rate: 85,
    paypal_email: 'ann.consultant@example.com',
    available: true,
  }
];

/**
 * Demo stories data
 */
export const demoStories: Partial<Stories>[] = [
  {
    id: '1',
    title: 'Finding Light - My Story',
    snippet: "My journey through darkness to find meaning and purpose again.",
    content: `My name is Kelvin Juma, and for a long time, I didn't know how to explain what I was feeling. From the outside I probably looked fine—just another 17-year-old trying to get through school, crack a few jokes, and stay normal. But inside, everything changed. It was like a switch flipped. Waking up in the morning was the hardest part. I would lie in bed staring at the ceiling, asking myself what the point of getting up even was. The things that used to bring me joy—and even the things I used to love—football, drawing, visiting with my cousins—felt dull and distant. I was tired all the time, but I couldn't sleep. I knew I needed to talk to someone. I really did. But every time I tried, I either got told to "man up" or "snap out of it." So I stopped trying. I lost everything that once protected me—my routine, my friendships, my goals. After many days I finally just...`,
    author_id: '5',
    published_at: '2023-04-15T10:30:00Z',
    cover_image: 'https://images.unsplash.com/photo-1541971297127-c4e5a4438b3b',
    tags: ['depression', 'recovery', 'teen'],
    tag_type: 'depression',
    is_featured: true,
  },
  {
    id: '2',
    title: 'Mental Health affects all',
    snippet: "How I learned that mental health is universal and affects everyone.",
    content: "Mental health isn't just a concern for certain people—it's something that affects all of us, regardless of background, age, or circumstance. For years, I worked in healthcare without realizing the impact of mental health on physical outcomes. It wasn't until I experienced burnout myself that I truly understood how interconnected our mental and physical wellbeing really is...",
    author_id: '2',
    published_at: '2023-04-02T14:20:00Z',
    cover_image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    tags: ['awareness', 'healthcare', 'universal'],
    tag_type: 'mental',
    is_featured: false,
  }
];

/**
 * Demo chat threads data
 */
export const demoChatThreads: Partial<ChatThreads>[] = [
  {
    id: '1',
    user_id: '1', // Test User
    consultant_id: '2', // Ann Silo
    last_message_at: new Date().toISOString(),
  }
];

/**
 * Demo chat messages data
 */
export const demoChatMessages: Partial<ChatMessages>[] = [
  {
    id: '1',
    thread_id: '1',
    sender_id: '1', // Test User
    content: 'Hi, I would like to consult about anxiety issues.',
    read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '2',
    thread_id: '1',
    sender_id: '2', // Ann Silo
    content: 'Hello! I\'d be happy to help. Could you tell me more about what you\'ve been experiencing?',
    read: true,
    created_at: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
  },
  {
    id: '3',
    thread_id: '1',
    sender_id: '1', // Test User
    content: 'I\'ve been having trouble sleeping and feeling constantly worried about work.',
    read: false,
    created_at: new Date(Date.now() - 200000).toISOString(), // 3.3 minutes ago
  }
];

/**
 * Demo transactions data
 */
export const demoTransactions: Partial<Transactions>[] = [
  {
    id: '1',
    user_id: '1', // Test User
    consultant_id: '2', // Ann Silo
    amount: 85,
    currency: 'USD',
    status: 'completed',
    payment_method: 'credit_card',
    description: 'One hour consultation session',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
  },
  {
    id: '2',
    user_id: '1', // Test User
    consultant_id: '2', // Ann Silo
    amount: 85,
    currency: 'USD',
    status: 'completed',
    payment_method: 'paypal',
    description: 'One hour consultation session',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    id: '3',
    user_id: '1', // Test User
    consultant_id: '2', // Ann Silo
    amount: 42.50,
    currency: 'USD',
    status: 'completed',
    payment_method: 'credit_card',
    description: '30 minute consultation session',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  }
];
