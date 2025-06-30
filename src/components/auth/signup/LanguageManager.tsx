
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

const languageOptions = [
  'English',
  'Spanish', 
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Mandarin',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Russian',
  'Dutch',
  'Swedish',
  'Norwegian'
];

interface LanguageManagerProps {
  languages: string[];
  onLanguagesChange: (languages: string[]) => void;
  isLoading: boolean;
}

export default function LanguageManager({
  languages,
  onLanguagesChange,
  isLoading
}: LanguageManagerProps) {
  const [customLanguage, setCustomLanguage] = useState('');

  const addLanguage = (lang: string) => {
    if (lang && !languages.includes(lang)) {
      onLanguagesChange([...languages, lang]);
    }
  };

  const removeLanguage = (lang: string) => {
    if (languages.length > 1) {
      onLanguagesChange(languages.filter(l => l !== lang));
    }
  };

  const handleCustomLanguageAdd = () => {
    if (customLanguage.trim()) {
      addLanguage(customLanguage.trim());
      setCustomLanguage('');
    }
  };

  return (
    <div className="space-y-2">
      <Label>Languages</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {languages.map((lang) => (
          <Badge key={lang} variant="secondary" className="flex items-center gap-1">
            {lang}
            {languages.length > 1 && (
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeLanguage(lang)}
              />
            )}
          </Badge>
        ))}
      </div>
      <Select onValueChange={addLanguage} disabled={isLoading}>
        <SelectTrigger className="text-black">
          <SelectValue className="text-black" placeholder="Add a language" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions
            .filter(lang => !languages.includes(lang))
            .map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input
          placeholder="Custom language"
          value={customLanguage}
          onChange={(e) => setCustomLanguage(e.target.value)}
          disabled={isLoading}
          className="text-black"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={handleCustomLanguageAdd}
          disabled={isLoading}
          className="text-black"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
