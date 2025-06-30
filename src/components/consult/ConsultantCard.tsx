import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Globe, 
  DollarSign, 
  Users,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface ConsultantCardProps {
  consultant: ConsultantData;
}

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  // Use the new default profile image URL
  const DEFAULT_PROFILE_IMAGE = "https://raw.githubusercontent.com/Our-Minds/our-minds.github.io/refs/heads/main/public/assets/default.png";

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] hover:border-[#025803] dark:hover:border-[#025803] overflow-hidden">
      {/* Profile Image - Full width at top */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={consultant.profile_image ? consultant.profile_image : DEFAULT_PROFILE_IMAGE} 
          alt={consultant.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge 
            className={`${consultant.available ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-300'}`}
          >
            {consultant.available ? 'Available' : 'Busy'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Profile Header */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2">
            {consultant.name}
          </h3>
        </div>

        {/* Consultant Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-[#025803]" />
            <span className="text-sm">{consultant.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Globe className="w-4 h-4 mr-2 text-[#025803]" />
            <span className="text-sm">{consultant.languages.join(', ')}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4 mr-2 text-[#025803]" />
            <span className="text-sm font-medium">${consultant.hourly_rate}/hour</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {consultant.specialization?.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="outline" className="text-xs border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#2a2a2a]">
                {spec}
              </Badge>
            ))}
            {consultant.specialization?.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#2a2a2a]">
                +{consultant.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Bio Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
          {consultant.bio}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/book-session/${consultant.id}`}>
            <Button className="w-full bg-[#025803] hover:bg-[#014502] text-white">
              Book Session
            </Button>
          </Link>
          <Link to={`/profile/${consultant.id}`}>
            <Button variant="outline" className="w-full border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
              <MessageSquare className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
