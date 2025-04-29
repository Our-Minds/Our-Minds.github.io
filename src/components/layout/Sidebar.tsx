
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { chatThreads } from '@/data/mockChats';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Count unread messages in chat threads for current user
    if (isAuthenticated && user) {
      const count = chatThreads.reduce((acc, thread) => {
        const unreadMessages = thread.messages.filter(
          msg => msg.senderId !== user.id && 
          !thread.messages.some(readMsg => 
            readMsg.senderId === user.id && 
            new Date(readMsg.timestamp) > new Date(msg.timestamp)
          )
        );
        return acc + unreadMessages.length;
      }, 0);
      setUnreadCount(count);
    }
  }, [isAuthenticated, user, chatThreads]);

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      href: '/chat',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      icon: Users,
      label: 'Consult',
      href: '/consult',
    },
    {
      icon: CalendarDays,
      label: 'Book a session',
      href: '/book-session',
    },
  ];

  return (
    <aside className={cn("w-16 md:w-52 h-full bg-gray-200 border-r border-gray-300", className)}>
      <nav className="flex flex-col h-full py-6">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg transition-colors relative',
                    isActive 
                      ? 'bg-mental-green-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-300',
                    'mb-1',
                    'w-full'
                  )}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  <span className="ml-3 hidden md:block">{item.label}</span>
                  {item.badge && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto p-4 border-t border-gray-300">
          <p className="text-xs text-gray-500 hidden md:block">Powered by</p>
          <p className="text-sm font-medium text-mental-green-700 hidden md:block">Our Minds</p>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
