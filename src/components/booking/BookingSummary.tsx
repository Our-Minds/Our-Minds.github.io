
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

interface BookingSummaryProps {
  consultant: ConsultantData;
  selectedDate: string;
  selectedTime: string;
  isLoading: boolean;
  onBookSession: () => void;
}

export function BookingSummary({ 
  consultant, 
  selectedDate, 
  selectedTime, 
  isLoading, 
  onBookSession 
}: BookingSummaryProps) {
  if (!selectedDate || !selectedTime) return null;

  return (
    <Card className="border-mental-green-200 dark:border-[#1a1a1a] bg-mental-green-50 dark:bg-[#212121]">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-mental-green-800 dark:text-[#025803]">Booking Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Consultant:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{consultant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Date:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Time:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">60 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total:</span>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">${consultant.hourly_rate}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onBookSession}
            disabled={isLoading}
            className="w-full bg-mental-green-600 hover:bg-mental-green-700 dark:bg-[#025803] dark:hover:bg-[#014502] text-white py-2 text-sm font-medium"
          >
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
