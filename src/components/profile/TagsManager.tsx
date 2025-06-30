
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TagsManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagsManager({ tags, onChange, maxTags = 6 }: TagsManagerProps) {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  
  const handleAddTag = () => {
    const tag = inputValue.trim();
    
    if (!tag) return;
    
    if (tags.includes(tag)) {
      toast({
        title: 'Tag already exists',
        description: 'This tag has already been added.',
        variant: 'destructive',
      });
      return;
    }
    
    if (tags.length >= maxTags) {
      toast({
        title: 'Maximum tags reached',
        description: `You can only add up to ${maxTags} tags.`,
        variant: 'destructive',
      });
      return;
    }
    
    onChange([...tags, tag]);
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a specialization tag..."
          className="flex-1"
          disabled={tags.length >= maxTags}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={!inputValue.trim() || tags.length >= maxTags}
        >
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      
      {tags.length >= maxTags && (
        <p className="text-amber-600 text-sm">
          Maximum of {maxTags} tags reached
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((tag, index) => (
          <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm">
            {tag}
            <button 
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={14} />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        
        {tags.length === 0 && (
          <p className="text-gray-500 text-sm">No tags added yet</p>
        )}
      </div>
    </div>
  );
}

export default TagsManager;
