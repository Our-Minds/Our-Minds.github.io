
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Story } from '@/utils/consultantTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MessageCircle, User, TrendingUp, Clock, MoreVertical } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { findOrCreateChatThread } from '@/utils/chatUtils';

interface StoryCardProps {
  story: Story;
  index: number;
  isSearching: boolean;
}

export function StoryCard({ story, index, isSearching }: StoryCardProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleStartChat = async (authorId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to chat with authors",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (user?.id === authorId) {
      toast({
        title: "Cannot chat with yourself",
        description: "You cannot start a chat with yourself",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const thread = await findOrCreateChatThread(authorId, user!.id);
      navigate(`/chat/${thread.id}`);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: "Failed to start chat",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  // Function to extract preview text from story content
  const getContentPreview = (content: string, maxLength: number = 120) => {
    if (!content) return '';
    const strippedContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return strippedContent.length > maxLength 
      ? strippedContent.substring(0, maxLength) + '...'
      : strippedContent;
  };

  // Function to get tag color based on tag type
  const getTagColor = (tagType: string) => {
    const tagColors = {
      mental: 'bg-blue-500',
      control: 'bg-purple-500', 
      drugs: 'bg-red-500',
      life: 'bg-green-500',
      anxiety: 'bg-orange-500',
      depression: 'bg-indigo-500'
    };
    return tagColors[tagType as keyof typeof tagColors] || 'bg-gray-500';
  };

  // Function to get reading time estimate
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const authorName = story.authorName || story.author?.name || 'Anonymous';
  const authorImage = story.authorImage || story.author?.profile_image || null;
  const authorId = story.author_id;
  const contentPreview = getContentPreview(story.content);
  const readingTime = getReadingTime(story.content);

  return (
    <div className="group relative">
      <Link to={`/story/${story.id}`} className="block">
        <Card className="overflow-hidden border border-gray-200 dark:border-[#3a3a3a] shadow-md bg-white dark:bg-[#2a2a2a] hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-2xl relative group-hover:border-[#025803] dark:group-hover:border-[#037004]">
          {/* Background Image at Top */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${story.cover_image || '/placeholder.svg'})`
              }}
            />
            
            {/* Trending badge overlay */}
            {index === 0 && !isSearching && (
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1 bg-gradient-to-r from-[#025803] to-[#037004] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  <TrendingUp className="w-3 h-3" />
                  <span>#1</span>
                </div>
              </div>
            )}

            {/* Story Tag and Reading Time Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center gap-3 flex-wrap">
                {story.tags && story.tags.length > 0 && (
                  <span 
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm ${getTagColor(story.tag_type)} bg-opacity-90`}
                  >
                    {story.tags[0]}
                  </span>
                )}
                <div className="flex items-center gap-2 text-xs text-white bg-black bg-opacity-50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-3 h-3" />
                  <span>{readingTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Story Content Below Image */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Story Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-[#025803] dark:group-hover:text-[#037004] transition-colors duration-300">
                  {story.title}
                </h3>

                {/* Content Preview */}
                {contentPreview && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 text-sm">
                    {contentPreview}
                  </p>
                )}

                {/* Publication Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatDistanceToNow(new Date(story.published_at), { addSuffix: true })}</span>
                </div>
              </div>
              
              {/* Enhanced Author Info & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#3a3a3a]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={authorImage || '/placeholder.svg'} 
                      alt={authorName} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-[#3a3a3a] shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-[#2a2a2a] rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{authorName}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3a3a] transition-colors duration-200 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border-0 bg-white/95 dark:bg-[#2a2a2a]/95 backdrop-blur-sm">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/profile/${authorId}`);
                      }}
                      className="rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a]"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStartChat(authorId);
                      }}
                      className="rounded-lg hover:bg-[#025803]/10 dark:hover:bg-[#025803]/20 text-[#025803] dark:text-[#037004]"
                    >
                      <MessageCircle className="mr-3 h-4 w-4" />
                      <span className="font-medium">Chat with {authorName.split(' ')[0]}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#025803]/0 to-[#025803]/0 group-hover:from-[#025803]/5 group-hover:to-transparent transition-all duration-500 rounded-2xl pointer-events-none"></div>
        </Card>
      </Link>
    </div>
  );
}
