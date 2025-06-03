
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatContent from '@/components/chat/ChatContent';
import AuthRedirect from '@/components/auth/AuthRedirect';
import { useChatThread } from '@/hooks/useChatThread';

export function ChatPage() {
  const { consultantId, threadId } = useParams<{ consultantId?: string; threadId?: string }>();
  const { isAuthenticated } = useAuth();
  const { selectedChatId, setSelectedChatId } = useChatThread(consultantId, threadId);
  
  if (!isAuthenticated) {
    return <AuthRedirect />;
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-80 h-full">
          <ChatSidebar 
            selectedChatId={selectedChatId} 
            onSelectChat={setSelectedChatId}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <ChatContent selectedChatId={selectedChatId} />
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;
