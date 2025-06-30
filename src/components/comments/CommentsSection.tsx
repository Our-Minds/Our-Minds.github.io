
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommentsSectionProps {
  storyId: string;
}

export function CommentsSection({ storyId }: CommentsSectionProps) {
  const { 
    comments, 
    isLoading, 
    addComment, 
    voteComment, 
    isAddingComment, 
    isVoting 
  } = useComments(storyId);

  const handleAddComment = (content: string) => {
    addComment({ content });
  };

  const handleReply = (parentCommentId: string, content: string) => {
    addComment({ content, parentCommentId });
  };

  const handleVote = (commentId: string, voteType: 'upvote' | 'downvote' | null) => {
    voteComment({ commentId, voteType });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-[#037004]">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Add Comment Form - Compact */}
      <div className="p-3 border-b border-border bg-muted flex-shrink-0">
        <CommentForm
          onSubmit={handleAddComment}
          isSubmitting={isAddingComment}
        />
      </div>

      {/* Comments List - Better scroll handling */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {comments.length === 0 ? (
            <div className="text-center py-6 px-4 text-muted-foreground">
              <MessageCircle className="mx-auto h-8 w-8 mb-3 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onVote={handleVote}
                  onReply={handleReply}
                  isVoting={isVoting}
                  isReplying={isAddingComment}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
