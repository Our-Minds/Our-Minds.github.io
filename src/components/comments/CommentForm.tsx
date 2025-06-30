
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitText?: string;
  isSubmitting?: boolean;
  isReply?: boolean;
}

export function CommentForm({ 
  onSubmit, 
  onCancel, 
  placeholder = "Write a comment...", 
  submitText = "Post Comment",
  isSubmitting = false,
  isReply = false
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center text-muted-foreground bg-muted rounded-lg border border-border">
        <MessageCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>Please log in to join the discussion</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          size={isReply ? "sm" : "default"}
          className="bg-[#037004] hover:bg-[#025803] text-white"
        >
          {isSubmitting ? "Posting..." : submitText}
        </Button>
      </div>
    </form>
  );
}
