
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

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

interface ConsultantDetailsProps {
  consultant: ConsultantData;
}

export function ConsultantDetails({ consultant }: ConsultantDetailsProps) {
  return (
    <>
      {/* Bio Section */}
      {consultant.bio && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{consultant.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Specializations */}
      {consultant.specialization && consultant.specialization.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {consultant.specialization.map((spec: string, index: number) => (
                <Badge key={index} variant="outline">
                  {spec}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages */}
      {consultant.languages && consultant.languages.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-gray-500" />
              <span>{consultant.languages.join(', ')}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
