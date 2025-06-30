
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/types/comments';

export function useComments(storyId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', storyId],
    queryFn: async (): Promise<Comment[]> => {
      // Fetch comments with author data
      const { data: commentsData, error: commentsError } = await supabase
        .from('story_comments')
        .select(`
          *,
          users!user_id (
            name,
            profile_image
          )
        `)
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch user votes if authenticated
      let userVotes: any[] = [];
      if (user) {
        const { data: votesData, error: votesError } = await supabase
          .from('comment_votes')
          .select('comment_id, vote_type')
          .eq('user_id', user.id)
          .in('comment_id', commentsData?.map(c => c.id) || []);

        if (!votesError) {
          userVotes = votesData || [];
        }
      }

      // Transform and organize comments
      const transformedComments: Comment[] = (commentsData || []).map(comment => ({
        id: comment.id,
        story_id: comment.story_id,
        user_id: comment.user_id,
        parent_comment_id: comment.parent_comment_id,
        content: comment.content,
        upvotes: comment.upvotes,
        downvotes: comment.downvotes,
        is_edited: comment.is_edited,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: comment.users ? {
          name: comment.users.name,
          profile_image: comment.users.profile_image
        } : undefined,
        user_vote: userVotes.find(v => v.comment_id === comment.id)?.vote_type || null
      }));

      // Organize into nested structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      transformedComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      transformedComments.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(commentMap.get(comment.id)!);
          }
        } else {
          rootComments.push(commentMap.get(comment.id)!);
        }
      });

      return rootComments;
    },
    enabled: !!storyId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: string }) => {
      if (!user) throw new Error('Must be logged in to comment');

      const { data, error } = await supabase
        .from('story_comments')
        .insert({
          story_id: storyId,
          user_id: user.id,
          parent_comment_id: parentCommentId || null,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to post comment",
        description: error.message || "Could not post your comment",
        variant: "destructive"
      });
    }
  });

  const voteCommentMutation = useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: string; voteType: 'upvote' | 'downvote' | null }) => {
      if (!user) throw new Error('Must be logged in to vote');

      if (voteType === null) {
        // Remove vote
        const { error } = await supabase
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Upsert vote
        const { error } = await supabase
          .from('comment_votes')
          .upsert({
            comment_id: commentId,
            user_id: user.id,
            vote_type: voteType
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to vote",
        description: error.message || "Could not register your vote",
        variant: "destructive"
      });
    }
  });

  return {
    comments,
    isLoading,
    addComment: addCommentMutation.mutate,
    voteComment: voteCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isVoting: voteCommentMutation.isPending
  };
}
