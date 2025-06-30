
import { useState, FormEvent, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadChatAttachment, FileUploadResult } from '@/utils/fileUpload';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInputProps {
  onSendMessage: (content: string, attachment?: FileUploadResult) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload files',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadResult = await uploadChatAttachment(file, user.id);
      onSendMessage(`📎 ${file.name}`, uploadResult);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#161b22] border-t border-gray-100 dark:border-[#30363d] px-2 py-2 rounded-b-xl shadow-lg">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2"
        autoComplete="off"
      >
        {/* File attachment button */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`
              ${isMobile ? 'h-12 w-12' : 'h-12 w-12'}
              rounded-full hover:bg-gray-100 dark:hover:bg-[#252525]
              text-gray-500 dark:text-gray-400 transition-all duration-150
              focus-visible:ring-2 focus-visible:ring-[#025803]
              border border-transparent
              active:scale-90
            `}
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip size={isMobile ? 20 : 22} />
            <span className="sr-only">Attach file</span>
          </Button>
        </div>
        {/* Message input */}
        <div className="flex-1 relative">
          <div className="flex items-end">
            <textarea
              placeholder={isUploading ? "Uploading..." : "Type your message..."}
              className={`
                flex-1 resize-none border border-gray-200 dark:border-[#30363d]
                rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#025803]
                focus:border-transparent text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-[#0d1117]
                shadow-md transition-all duration-150
                ${isMobile ? 'p-4 text-base min-h-[44px] max-h-32' : 'p-4 text-sm min-h-[52px] max-h-40'}
              `}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isUploading}
              rows={1}
              style={{
                height: 'auto',
                minHeight: isMobile ? '44px' : '52px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, isMobile ? 128 : 160) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className={`
                ${isMobile ? 'h-12 w-12 ml-2' : 'h-12 w-12 ml-3'}
                rounded-full bg-[#025803] hover:bg-[#014502]
                shadow-lg active:scale-90 transition-all duration-100
                disabled:opacity-60 flex-shrink-0
                text-white
              `}
              style={{ minWidth: 44, minHeight: 44 }}
              disabled={!message.trim() || isUploading}
            >
              <Send size={isMobile ? 18 : 20} />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
