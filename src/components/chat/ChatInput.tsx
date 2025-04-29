
import { useState, FormEvent } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="p-3 border-t border-mental-green-100 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-full text-mental-green-600 hover:bg-mental-green-50"
        >
          <Paperclip size={20} />
          <span className="sr-only">Attach file</span>
        </button>
        
        <input
          type="text"
          placeholder="Type something..."
          className="flex-1 p-2 border border-mental-green-200 rounded-full focus:outline-none focus:ring-1 focus:ring-mental-green-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-mental-green-600 hover:bg-mental-green-700"
          disabled={!message.trim()}
        >
          <Send size={18} />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}

export default ChatInput;
