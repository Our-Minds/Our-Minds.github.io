
import { Search } from 'lucide-react';

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ChatSearch({ searchQuery, setSearchQuery }: ChatSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search chats..."
        className="w-full pl-8 pr-4 py-2 rounded-md border border-mental-green-200 focus:outline-none focus:ring-1 focus:ring-mental-green-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default ChatSearch;
