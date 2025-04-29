
import { Label } from '@/components/ui/label';

const STORY_TAG_OPTIONS = [
  { value: 'mental', label: 'Mental Health' },
  { value: 'control', label: 'Self Control' },
  { value: 'drugs', label: 'Substance Abuse' },
  { value: 'life', label: 'Life Skills' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' }
];

interface StoryTagSelectorProps {
  selectedTag: string;
  onTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function StoryTagSelector({ selectedTag, onTagChange }: StoryTagSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tagType">Primary Tag</Label>
      <select 
        id="tagType" 
        name="tagType"
        className="w-full h-10 pl-3 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mental-green-500"
        value={selectedTag}
        onChange={onTagChange}
      >
        {STORY_TAG_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { STORY_TAG_OPTIONS };
