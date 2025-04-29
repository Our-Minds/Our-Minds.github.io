
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateStoryForm from "./CreateStoryForm";

export function CreateStoryDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Share Your Story</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Story</DialogTitle>
        </DialogHeader>
        <CreateStoryForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoryDialog;
