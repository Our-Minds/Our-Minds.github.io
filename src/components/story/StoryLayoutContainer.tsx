
import { Story } from "@/utils/types";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileStoryCommentsToggle from "./MobileStoryCommentsToggle";
import { StoryContent } from "./StoryContent";
import { SimilarStories } from "./SimilarStories";
import { CommentsSection } from "@/components/comments/CommentsSection";

interface StoryLayoutContainerProps {
  story: Story;
}

export function StoryLayoutContainer({ story }: StoryLayoutContainerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileStoryCommentsToggle story={story} />;
  }

  // Desktop layout
  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left Section - Story Content + Similar Stories */}
      <div className="flex-1 lg:w-2/3 flex flex-col min-h-0">
        <div className="bg-card rounded-xl shadow-sm border border-border flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <StoryContent story={story} />
            {/* Similar Stories Section */}
            <div className="border-t border-border mt-4">
              <div className="p-6 bg-muted border-b border-border">
                <h3 className="font-semibold text-[#037004] text-xl">Similar Stories</h3>
                <p className="text-base text-muted-foreground">More stories you might like</p>
              </div>
              <div className="max-h-96 overflow-y-auto bg-card">
                <SimilarStories currentStory={story} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section - Comments */}
      <div className="lg:w-1/3 flex flex-col min-h-0">
        <div className="bg-card rounded-xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border bg-muted flex-shrink-0">
            <h3 className="font-semibold text-[#037004] text-xl">Discussion</h3>
            <p className="text-base text-muted-foreground">Join the conversation</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <CommentsSection storyId={story.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryLayoutContainer;
