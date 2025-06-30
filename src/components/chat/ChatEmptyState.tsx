
import { MessageSquare, Users, Sparkles } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-mental-green-100 to-mental-green-200 dark:from-[#025803]/20 dark:to-[#025803]/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-10 h-10 text-mental-green-600 dark:text-[#025803]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Welcome to Messages
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          Select a conversation from the sidebar to start chatting with consultants and get the support you need.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>Connect • Share • Grow</span>
        </div>
      </div>
    </div>
  );
}

export default ChatEmptyState;
