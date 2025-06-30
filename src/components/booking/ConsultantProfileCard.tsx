
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, DollarSign, Star } from 'lucide-react';

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

interface ConsultantProfileCardProps {
  consultant: ConsultantData;
}

export function ConsultantProfileCard({ consultant }: ConsultantProfileCardProps) {
  return (
    <Card className="sticky top-20 bg-white dark:bg-[#212121] border-gray-200 dark:border-[#1a1a1a]">
      <CardContent className="p-0">
        {/* Profile Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={consultant.profile_image} 
            alt={consultant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#025803] text-white text-xs">
              Available
            </Badge>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="p-4 space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{consultant.name}</h2>
            <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
              <Star className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-xs">4.8 (124 reviews)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-3 h-3 mr-2 text-mental-green-600 dark:text-[#025803]" />
              <span className="text-xs">{consultant.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Globe className="w-3 h-3 mr-2 text-mental-green-600 dark:text-[#025803]" />
              <span className="text-xs">{consultant.languages.join(', ')}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <DollarSign className="w-3 h-3 mr-2 text-mental-green-600 dark:text-[#025803]" />
              <span className="text-xs font-medium">${consultant.hourly_rate}/hour</span>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">Specializations</h4>
            <div className="flex flex-wrap gap-1">
              {consultant.specialization?.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs px-2 py-0.5 border-gray-200 dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1a]">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">About</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{consultant.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
