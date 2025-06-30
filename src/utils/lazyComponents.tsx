
import { lazy } from 'react';
import { LazyPageWrapper } from '@/components/layout/LazyPageWrapper';

// Lazy load major pages
export const LazyHomePage = lazy(() => import('@/pages/HomePage'));
export const LazyChatPage = lazy(() => import('@/pages/ChatPage'));
export const LazyProfilePage = lazy(() => import('@/pages/ProfilePage'));
export const LazyConsultPage = lazy(() => import('@/pages/ConsultPage'));
export const LazyBookSessionPage = lazy(() => import('@/pages/BookSessionPage'));
export const LazyAdminPanel = lazy(() => import('@/pages/AdminPanel'));
export const LazyAboutPage = lazy(() => import('@/pages/AboutPage'));
export const LazyStoryPage = lazy(() => import('@/pages/StoryPage'));
export const LazyPublicProfilePage = lazy(() => import('@/pages/PublicProfilePage'));

// Wrapper components with Suspense
export const HomePage = () => (
  <LazyPageWrapper>
    <LazyHomePage />
  </LazyPageWrapper>
);

export const ChatPage = () => (
  <LazyPageWrapper>
    <LazyChatPage />
  </LazyPageWrapper>
);

export const ProfilePage = () => (
  <LazyPageWrapper>
    <LazyProfilePage />
  </LazyPageWrapper>
);

export const ConsultPage = () => (
  <LazyPageWrapper>
    <LazyConsultPage />
  </LazyPageWrapper>
);

export const BookSessionPage = () => (
  <LazyPageWrapper>
    <LazyBookSessionPage />
  </LazyPageWrapper>
);

export const AdminPanel = () => (
  <LazyPageWrapper>
    <LazyAdminPanel />
  </LazyPageWrapper>
);

export const AboutPage = () => (
  <LazyPageWrapper>
    <LazyAboutPage />
  </LazyPageWrapper>
);

export const StoryPage = () => (
  <LazyPageWrapper>
    <LazyStoryPage />
  </LazyPageWrapper>
);

export const PublicProfilePage = () => (
  <LazyPageWrapper>
    <LazyPublicProfilePage />
  </LazyPageWrapper>
);
