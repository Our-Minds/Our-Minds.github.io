
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { ConsultantCard } from './ConsultantCard';

interface ConsultantData {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  specialization: string[];
  languages: string[];
  location: string;
  bio: string;
  hourly_rate: number;
  available: boolean;
}

interface ConsultantGridProps {
  consultants: ConsultantData[];
  isLoading: boolean;
}

export function ConsultantGrid({ consultants, isLoading }: ConsultantGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-[#2a2a2a] rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-[#2a2a2a] rounded w-32"></div>
                <div className="h-3 bg-gray-200 dark:bg-[#2a2a2a] rounded w-24"></div>
                <div className="h-3 bg-gray-200 dark:bg-[#2a2a2a] rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-[#2a2a2a] rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (consultants.length === 0) {
    return (
      <Card className="text-center py-12 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
        <CardContent>
          <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No consultants found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search criteria or browse all available professionals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {consultants.map((consultant) => (
        <ConsultantCard key={consultant.id} consultant={consultant} />
      ))}
    </div>
  );
}
