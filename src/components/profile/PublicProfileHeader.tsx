import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin, DollarSign } from 'lucide-react';

interface ConsultantData {
  bio: string;
  specialization: string[];
  location: string;
  languages: string[];
  hourly_rate: number;
  rating: number;
  review_count: number;
  available: boolean;
}

interface ProfileData {
  id: string;
  name: string;
  profile_image: string;
  role: string;
  consultant?: ConsultantData;
}

interface PublicProfileHeaderProps {
  profile: ProfileData;
  onStartChat: () => void;
}

export function PublicProfileHeader({ profile, onStartChat }: PublicProfileHeaderProps) {
  const isConsultant = profile.role === 'consultant' || profile.role === 'admin' || profile.role === 'owner';
  // Default profile image URL
  const DEFAULT_PROFILE_IMAGE = "https://raw.githubusercontent.com/Our-Minds/our-minds.github.io/refs/heads/main/public/assets/default.png";
  // Use profile.profile_image or the default
  const imageSrc = profile.profile_image ? profile.profile_image : DEFAULT_PROFILE_IMAGE;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={imageSrc}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
            }}
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            
            {isConsultant && profile.consultant && (
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Badge variant={profile.consultant.available ? "default" : "secondary"}>
                    {profile.consultant.available ? "Available" : "Unavailable"}
                  </Badge>
                  <Badge variant="outline">{profile.role}</Badge>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                  {profile.consultant.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{profile.consultant.location}</span>
                    </div>
                  )}
                  
                  {profile.consultant.hourly_rate && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>${profile.consultant.hourly_rate}/hour</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button onClick={onStartChat} className="flex items-center gap-2">
                <MessageCircle size={16} />
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
