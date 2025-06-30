
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface ConsultantSearchFiltersProps {
  searchQuery: string;
  selectedSpecialization: string;
  onSearchChange: (query: string) => void;
  onSpecializationChange: (specialization: string) => void;
}

export function ConsultantSearchFilters({ 
  searchQuery, 
  selectedSpecialization, 
  onSearchChange, 
  onSpecializationChange 
}: ConsultantSearchFiltersProps) {
  return (
    <Card className="mb-8 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Search className="w-5 h-5 text-[#025803]" />
          Find the Right Professional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <Input
              placeholder="Search by name, location, or specialty..."
              className="pl-10 bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] rounded-md bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100"
            value={selectedSpecialization}
            onChange={(e) => onSpecializationChange(e.target.value)}
          >
            <option value="">All Specializations</option>
            <option value="Anxiety">Anxiety</option>
            <option value="Depression">Depression</option>
            <option value="Trauma">Trauma</option>
            <option value="Relationships">Relationships</option>
            <option value="Addiction">Addiction</option>
          </select>

          <Button className="bg-[#025803] hover:bg-[#014502] text-white">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
