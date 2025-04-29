import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-white text-base">
      <Navbar />

      <div className="flex flex-1 h-[calc(100vh-64px)]">
        {showSidebar && (
          <div className="hidden md:block w-20 md:w-60 flex-shrink-0">
            <div className="flex flex-1 h-[calc(100vh-64px)]">
              <Sidebar className="h-full" />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {isMobile && showSidebar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 z-10">
          <div className="flex justify-around items-center py-2">
            <a href="/" className="flex flex-col items-center text-mental-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-sm">Home</span>
            </a>
            <a href="/chat" className="flex flex-col items-center text-gray-500 hover:text-mental-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="text-sm">Chat</span>
            </a>
            <a href="/consult" className="flex flex-col items-center text-gray-500 hover:text-mental-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="text-sm">Consult</span>
            </a>
            <a href="/book-session" className="flex flex-col items-center text-gray-500 hover:text-mental-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-sm">Book</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}

export default Layout;
