
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import StoryPage from './pages/StoryPage';
import ChatPage from './pages/ChatPage';
import ConsultPage from './pages/ConsultPage';
import BookSessionPage from './pages/BookSessionPage';
import AdminPanel from './pages/AdminPanel';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/auth/AuthGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="theme-preference">
          <RouterProvider router={
            createBrowserRouter([
              { path: "/", element: <Navigate to="/home" /> },
              { path: "/home", element: <Index /> },
              { path: "/about", element: <AboutPage /> },
              { path: "/login", element: <LoginPage /> },
              { path: "/signup", element: <SignupPage /> },
              { path: "/profile", element: <AuthGuard><ProfilePage /></AuthGuard> },
              { path: "/profile/:userId", element: <PublicProfilePage /> },
              { path: "/story/:storyId", element: <StoryPage /> },
              { path: "/chat/:threadId?", element: <AuthGuard><ChatPage /></AuthGuard> },
              { path: "/consult", element: <ConsultPage /> },
              { path: "/book-session/:consultantId?", element: <AuthGuard><BookSessionPage /></AuthGuard> },
              { path: "/admin", element: <AuthGuard requireAdmin={true}><AdminPanel /></AuthGuard> },
              { path: "*", element: <NotFound /> }
            ])
          } />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
