
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

const specializationOptions = [
  'Anxiety',
  'Depression', 
  'Stress Management',
  'Relationship Counseling',
  'Family Therapy',
  'Trauma Therapy',
  'Addiction Counseling',
  'Career Counseling',
  'Life Coaching',
  'Grief Counseling',
  'Child Psychology',
  'Adolescent Therapy',
  'Group Therapy',
  'Cognitive Behavioral Therapy',
  'Mindfulness-Based Therapy'
];

interface SpecializationManagerProps {
  specializations: string[];
  onSpecializationsChange: (specializations: string[]) => void;
  isLoading: boolean;
}

export default function SpecializationManager({
  specializations,
  onSpecializationsChange,
  isLoading
}: SpecializationManagerProps) {
  const [customSpecialization, setCustomSpecialization] = useState('');

  const addSpecialization = (spec: string) => {
    if (spec && !specializations.includes(spec)) {
      onSpecializationsChange([...specializations, spec]);
    }
  };

  const removeSpecialization = (spec: string) => {
    onSpecializationsChange(specializations.filter(s => s !== spec));
  };

  const handleCustomSpecializationAdd = () => {
    if (customSpecialization.trim()) {
      addSpecialization(customSpecialization.trim());
      setCustomSpecialization('');
    }
  };

  return (
    <div className="space-y-2">
      <Label>Specializations</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {specializations.map((spec) => (
          <Badge key={spec} variant="secondary" className="flex items-center gap-1">
            {spec}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeSpecialization(spec)}
            />
          </Badge>
        ))}
      </div>
      <Select onValueChange={addSpecialization} disabled={isLoading}>
        <SelectTrigger className="text-black">
          <SelectValue className="text-black" placeholder="Add a specialization" />
        </SelectTrigger>
        <SelectContent>
          {specializationOptions
            .filter(spec => !specializations.includes(spec))
            .map((spec) => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input
          placeholder="Custom specialization"
          value={customSpecialization}
          onChange={(e) => setCustomSpecialization(e.target.value)}
          disabled={isLoading}
          className="text-black"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={handleCustomSpecializationAdd}
          disabled={isLoading}
          className="text-black"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
