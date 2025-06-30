
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  isMobile: boolean;
  showComments: boolean;
  onClick: () => void;
}

export function BackButton({ isMobile, showComments, onClick }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`mb-4 flex items-center gap-2 text-[#037004] hover:text-[#025803] hover:bg-[#025803]/10 transition-colors ${isMobile ? "mb-2" : ""}`}
      onClick={onClick}
    >
      <ArrowLeft size={16} />
      <span className="hidden sm:inline">
        {isMobile && showComments ? "Back to Story" : "Back to Stories"}
      </span>
      <span className="sm:hidden">
        {isMobile && showComments ? "Story" : "Back"}
      </span>
    </Button>
  );
}

export default BackButton;
