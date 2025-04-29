
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StoryFormFieldsProps {
  title: string;
  snippet: string;
  content: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function StoryFormFields({ title, snippet, content, onInputChange }: StoryFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Story Title</Label>
        <Input 
          id="title" 
          name="title" 
          value={title}
          onChange={onInputChange}
          placeholder="Enter a title for your story" 
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="snippet">Short Description</Label>
        <Input 
          id="snippet" 
          name="snippet" 
          value={snippet}
          onChange={onInputChange}
          placeholder="A brief description that will appear in previews" 
        />
        <p className="text-xs text-gray-500">Optional - will use the beginning of your story if left blank</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Story Content</Label>
        <Textarea 
          id="content" 
          name="content" 
          value={content}
          onChange={onInputChange}
          placeholder="Share your story..." 
          className="min-h-[200px]"
          required
        />
      </div>
    </>
  );
}
