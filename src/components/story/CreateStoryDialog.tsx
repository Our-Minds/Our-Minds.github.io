
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Story } from "@/utils/consultantTypes";
import CreateStoryForm from "./CreateStoryForm";

interface CreateStoryDialogProps {
  children?: React.ReactNode;
  story?: Story;
  onOpenChange?: (open: boolean) => void;
}

export function CreateStoryDialog({ children, story, onOpenChange }: CreateStoryDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button>Share Your Story</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{story ? 'Edit Your Story' : 'Create a New Story'}</DialogTitle>
        </DialogHeader>
        <CreateStoryForm story={story} onClose={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoryDialog;
