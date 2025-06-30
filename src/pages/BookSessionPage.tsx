import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { consultants as mockConsultants } from '@/data/mockConsultants';
import { ConsultantProfileCard } from '@/components/booking/ConsultantProfileCard';
import { DateSelector } from '@/components/booking/DateSelector';
import { TimeSelector } from '@/components/booking/TimeSelector';
import { BookingSummary } from '@/components/booking/BookingSummary';

interface SessionSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  day: string;
  slots: SessionSlot[];
}

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

export function BookSessionPage() {
  const { consultantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch consultant details
  const { data: consultant, isLoading: consultantLoading, error } = useQuery({
    queryKey: ['consultant', consultantId],
    queryFn: async (): Promise<ConsultantData | null> => {
      if (!consultantId) {
        console.log('No consultant ID provided');
        return null;
      }
      
      console.log('Fetching consultant with ID:', consultantId);
      
      // First try mock data as fallback
      const mockConsultant = mockConsultants.find(c => c.id === consultantId);
      
      try {
        // Try to fetch from the database
        const { data: consultantUser, error: userError } = await supabase
          .from('users')
          .select('id, name, email, profile_image')
          .eq('id', consultantId)
          .eq('role', 'consultant')
          .maybeSingle();
          
        if (userError) {
          console.log('User fetch error:', userError);
          // Use mock data as fallback
          if (mockConsultant) {
            console.log('Using mock consultant as fallback:', mockConsultant.name);
            return {
              id: mockConsultant.id,
              name: mockConsultant.name,
              email: `${mockConsultant.name.toLowerCase().replace(' ', '.')}@example.com`,
              profile_image: mockConsultant.profileImage,
              specialization: mockConsultant.specialization,
              languages: mockConsultant.languages,
              location: mockConsultant.location,
              bio: mockConsultant.bio,
              hourly_rate: mockConsultant.hourlyRate,
              available: mockConsultant.isOnline
            };
          }
          throw userError;
        }

        if (!consultantUser) {
          console.log('No consultant user found, trying mock data');
          if (mockConsultant) {
            console.log('Found consultant in mock data:', mockConsultant.name);
            return {
              id: mockConsultant.id,
              name: mockConsultant.name,
              email: `${mockConsultant.name.toLowerCase().replace(' ', '.')}@example.com`,
              profile_image: mockConsultant.profileImage,
              specialization: mockConsultant.specialization,
              languages: mockConsultant.languages,
              location: mockConsultant.location,
              bio: mockConsultant.bio,
              hourly_rate: mockConsultant.hourlyRate,
              available: mockConsultant.isOnline
            };
          }
          return null;
        }
        
        console.log('Found consultant user:', consultantUser.name);
        
        // Try to fetch consultant details
        const { data: consultantDetails } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', consultantId)
          .eq('approval_status', 'approved')
          .maybeSingle();
        
        const details = consultantDetails || {
          specialization: ['General Counseling'],
          languages: ['English'],
          location: 'Remote',
          bio: 'Experienced mental health professional.',
          hourly_rate: 75,
          available: true
        };

        console.log('Returning consultant data for:', consultantUser.name);
        
        return {
          id: consultantUser.id,
          name: consultantUser.name,
          email: consultantUser.email,
          profile_image: consultantUser.profile_image || 'https://i.pravatar.cc/150?img=2',
          specialization: details.specialization || ['General Counseling'],
          languages: details.languages || ['English'],
          location: details.location || 'Remote',
          bio: details.bio || 'Experienced mental health professional.',
          hourly_rate: details.hourly_rate || 75,
          available: details.available !== false
        };
      } catch (error) {
        console.error("Error fetching consultant:", error);
        
        // Final fallback to mock data
        if (mockConsultant) {
          console.log('Using mock consultant as final fallback:', mockConsultant.name);
          return {
            id: mockConsultant.id,
            name: mockConsultant.name,
            email: `${mockConsultant.name.toLowerCase().replace(' ', '.')}@example.com`,
            profile_image: mockConsultant.profileImage,
            specialization: mockConsultant.specialization,
            languages: mockConsultant.languages,
            location: mockConsultant.location,
            bio: mockConsultant.bio,
            hourly_rate: mockConsultant.hourlyRate,
            available: mockConsultant.isOnline
          };
        }
        
        console.log('No fallback data available');
        return null;
      }
    },
    enabled: !!consultantId,
    retry: false, // Don't retry to avoid endless loading
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Generate mock schedule for the next 7 days
  const generateSchedule = (): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const daySchedule: DaySchedule = {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        slots: [
          { time: '09:00', available: Math.random() > 0.3 },
          { time: '10:00', available: Math.random() > 0.3 },
          { time: '11:00', available: Math.random() > 0.3 },
          { time: '14:00', available: Math.random() > 0.3 },
          { time: '15:00', available: Math.random() > 0.3 },
          { time: '16:00', available: Math.random() > 0.3 },
        ]
      };
      
      schedule.push(daySchedule);
    }
    
    return schedule;
  };

  const [schedule] = useState<DaySchedule[]>(generateSchedule());

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookSession = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a session",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Selection Required",
        description: "Please select both date and time for your session",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const startTime = `${selectedDate}T${selectedTime}:00.000Z`;
      const endDate = new Date(`${selectedDate}T${selectedTime}:00.000Z`);
      endDate.setHours(endDate.getHours() + 1);
      const endTime = endDate.toISOString();

      const { error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          consultant_id: consultantId,
          start_time: startTime,
          end_time: endTime,
          status: 'scheduled',
          notes: null
        });

      if (error) throw error;

      toast({
        title: "Session Booked Successfully",
        description: `Your session is scheduled for ${selectedDate} at ${selectedTime}`,
      });

      navigate('/profile');
    } catch (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Booking Failed",
        description: "Could not book the session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if no consultant ID
  if (!consultantId) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#212121] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <User className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Invalid Request</h2>
            <p className="text-gray-600 dark:text-gray-300">No consultant ID provided.</p>
            <Button onClick={() => navigate('/consult')} className="bg-mental-green-600 hover:bg-mental-green-700 dark:bg-[#025803] dark:hover:bg-[#014502]">
              Browse Consultants
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state only while actually loading
  if (consultantLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#212121] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mental-green-600 dark:border-[#025803] mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading consultant details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error only if we really can't find any data and there was an actual error
  if (!consultant && error) {
    console.log('Rendering error state, error:', error, 'consultant:', consultant);
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#212121] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <User className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Consultant Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">The consultant you're looking for is not available.</p>
            <Button onClick={() => navigate('/consult')} className="bg-mental-green-600 hover:bg-mental-green-700 dark:bg-[#025803] dark:hover:bg-[#014502]">
              Browse Consultants
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // If we have consultant data (either from DB or mock), render the booking page
  if (consultant) {
    console.log('Rendering booking page for consultant:', consultant.name);
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#212121]">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40 bg-white dark:bg-[#212121] border-b border-gray-200 dark:border-[#1a1a1a] shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/consult')}
                    className="text-gray-600 dark:text-gray-300 hover:text-mental-green-600 dark:hover:text-[#025803]"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Book Session</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Schedule your consultation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Consultant Profile - Left Column */}
              <div className="lg:col-span-1">
                <ConsultantProfileCard consultant={consultant} />
              </div>

              {/* Booking Section - Right Column */}
              <div className="lg:col-span-2 space-y-6">
                <DateSelector 
                  schedule={schedule}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />

                {selectedDate && (
                  <TimeSelector 
                    schedule={schedule}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />
                )}

                <BookingSummary 
                  consultant={consultant}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  isLoading={isLoading}
                  onBookSession={handleBookSession}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Final fallback - show consultant not found if no data at all
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#212121] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <User className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Consultant Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">The consultant you're looking for is not available.</p>
          <Button onClick={() => navigate('/consult')} className="bg-mental-green-600 hover:bg-mental-green-700 dark:bg-[#025803] dark:hover:bg-[#014502]">
            Browse Consultants
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default BookSessionPage;
