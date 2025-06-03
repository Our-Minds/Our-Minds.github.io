
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count from database
  const { data: unreadMessages, refetch: refetchUnread } = useQuery({
    queryKey: ['unreadMessages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("Fetching unread messages for user:", user.id);
      
      try {
        // First get all threads where the user is involved (either as user or consultant)
        const { data: threads, error: threadsError } = await supabase
          .from('chat_threads')
          .select('id')
          .or(`user_id.eq.${user.id},consultant_id.eq.${user.id}`);
        
        if (threadsError) {
          console.error('Error fetching threads:', threadsError);
          return [];
        }
        
        if (!threads || threads.length === 0) return [];
        
        // Then get unread messages from those threads where the sender is not the current user
        const threadIds = threads.map(t => t.id);
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .in('thread_id', threadIds)
          .neq('sender_id', user.id)
          .eq('read', false);
        
        if (messagesError) {
          console.error('Error fetching unread messages:', messagesError);
          return [];
        }
        
        console.log("Unread messages:", messages?.length || 0);
        return messages || [];
      } catch (err) {
        console.error('Error fetching unread messages:', err);
        return [];
      }
    },
    enabled: !!isAuthenticated && !!user,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('sidebar-unread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          // If a new message is inserted that's not from the current user, refetch unread count
          if (payload.new && payload.new.sender_id !== user.id) {
            console.log("New message detected, refetching unread count...");
            refetchUnread();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `read=eq.true`,
        },
        () => {
          // If messages are marked as read, refetch the unread count
          console.log("Messages marked as read, refetching unread count...");
          refetchUnread();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetchUnread]);

  // Update unread count when data changes
  useEffect(() => {
    if (unreadMessages) {
      setUnreadCount(unreadMessages.length);
    }
  }, [unreadMessages]);

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
            const isActive = location.pathname === item.href || 
              (item.href === '/chat' && location.pathname.startsWith('/chat'));
            
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
