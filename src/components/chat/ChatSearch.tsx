
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatSearch({ value, onChange }: ChatSearchProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative">
      <Search className={`
        absolute left-3 top-1/2 transform -translate-y-1/2 
        text-gray-400 dark:text-gray-500
        ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}
      `} />
      <input
        type="text"
        placeholder="Search conversations..."
        className={`
          w-full rounded-xl border border-gray-200 dark:border-[#30363d] 
          focus:outline-none focus:ring-2 focus:ring-[#025803] focus:border-transparent 
          text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
          bg-gray-50 dark:bg-[#0d1117] transition-all
          ${isMobile 
            ? 'pl-9 pr-4 py-2.5 text-base' 
            : 'pl-10 pr-4 py-3 text-sm'
          }
        `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default ChatSearch;
