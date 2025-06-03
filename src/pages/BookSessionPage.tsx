import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, isSameDay, parseISO, getDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { findOrCreateChatThread } from '@/utils/chatUtils';
import { useQuery } from '@tanstack/react-query';
import { 
  ConsultantDetails, 
  BookableConsultant, 
  ConsultantAvailabilityRecord 
} from '@/utils/consultantTypes';
import { formatConsultantAvailability } from '@/utils/availabilityUtils';
import { consultants as mockConsultants } from '@/data/mockConsultants';
import { PayPalPaymentDialog } from '@/components/payment/PayPalPaymentDialog';

export function BookSessionPage() {
  const { consultantId } = useParams<{ consultantId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedConsultant, setSelectedConsultant] = useState<BookableConsultant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'consultant' | 'date' | 'time' | 'payment'>('consultant');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayPalDialog, setShowPayPalDialog] = useState(false);

  // Fetch consultants from Supabase
  const { data: consultantsData, isLoading } = useQuery({
    queryKey: ['bookable-consultants'],
    queryFn: async () => {
      try {
        // 1. First, fetch all users with consultant role
        const { data: consultantUsers, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            name,
            email,
            profile_image,
            role
          `)
          .eq('role', 'consultant');
          
        if (userError) throw userError;
        
        // 2. Get consultant details from consultants table using the IDs
        const consultantIds = consultantUsers.map(user => user.id);
        const { data: consultantDetails, error: consultantError } = await supabase
          .from('consultants')
          .select('*')
          .in('id', consultantIds);
          
        if (consultantError) throw consultantError;
        
        // 3. Fetch availability data for all consultants
        const { data: availabilityData, error: availError } = await supabase
          .from('consultant_availability')
          .select('*')
          .in('consultant_id', consultantIds);
          
        if (availError) throw availError;
        
        // Group availability by consultant ID
        const availabilityByConsultant: Record<string, ConsultantAvailabilityRecord[]> = {};
        availabilityData?.forEach(record => {
          if (!availabilityByConsultant[record.consultant_id]) {
            availabilityByConsultant[record.consultant_id] = [];
          }
          availabilityByConsultant[record.consultant_id].push(record);
        });
        
        // 4. Merge the data to create complete consultant profiles
        return consultantUsers.map(user => {
          // Find the details for this consultant or use defaults if not found
          const details: ConsultantDetails = consultantDetails?.find(c => c.id === user.id) || {
            specialization: [],
            languages: ['English'],
            location: 'Remote',
            bio: '',
            rating: 0,
            review_count: 0,
            hourly_rate: 50,
            available: false
          };
          
          const consultantAvailability = availabilityByConsultant[user.id] || [];
          
          // Format availability into structured format
          const formattedAvailability = formatConsultantAvailability(consultantAvailability);
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image || 'https://i.pravatar.cc/150?img=2',
            bio: details.bio,
            location: details.location,
            specialization: details.specialization,
            languages: details.languages,
            rating: 0, // Removed mock ratings
            review_count: 0, // Removed mock review counts
            hourly_rate: details.hourly_rate,
            available: details.available,
            isOnline: details.available,
            availability: formattedAvailability
          };
        });
      } catch (error) {
        console.error("Error fetching consultants:", error);
        
        // Fallback to mock data if there's an error
        console.log("Using mock consultants data as fallback");
        return mockConsultants.map(c => ({
          id: c.id,
          name: c.name,
          email: `${c.name.toLowerCase().replace(' ', '.')}@example.com`,
          profile_image: c.profileImage,
          specialization: c.specialization,
          languages: c.languages,
          location: c.location,
          bio: c.bio,
          rating: 0, // Removed mock ratings
          review_count: 0, // Removed mock review counts
          hourly_rate: c.hourlyRate,
          available: c.isOnline,
          isOnline: c.isOnline,
          availability: c.availability
        }));
      }
    }
  });
  
  const consultants = consultantsData || [];
  
  useEffect(() => {
    // If consultantId is provided, find that consultant
    if (consultantId && consultants.length > 0) {
      const foundConsultant = consultants.find(c => c.id === consultantId);
      if (foundConsultant) {
        setSelectedConsultant(foundConsultant);
        setCurrentStep('date');
      } else {
        navigate('/book-session');
        toast({
          title: "Consultant not found",
          description: "Please select another consultant.",
          variant: "destructive"
        });
      }
    }
  }, [consultantId, consultants, navigate, toast]);
  
  const getAvailableSlots = (date: Date | undefined) => {
    if (!selectedConsultant || !date) return [];
    
    try {
      const dayName = format(date, 'EEEE');
      const dayAvailability = selectedConsultant.availability.find(
        a => a.day === dayName
      );
      
      return dayAvailability ? dayAvailability.slots : [];
    } catch (error) {
      console.error("Error getting available slots:", error);
      return [];
    }
  };
  
  const handleConsultantSelect = (consultant: BookableConsultant) => {
    setSelectedConsultant(consultant);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setCurrentStep('date');
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    
    if (date) {
      setCurrentStep('time');
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setCurrentStep('payment');
  };
  
  const handlePayment = async () => {
    if (!user || !selectedConsultant) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a session",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Open PayPal dialog instead of processing payment immediately
    setShowPayPalDialog(true);
  };

  const handlePayPalPaymentComplete = async () => {
    if (!user || !selectedConsultant) return;
    
    setIsProcessing(true);
    
    try {
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          consultant_id: selectedConsultant.id,
          start_time: selectedDate 
            ? `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTimeSlot}:00` 
            : new Date().toISOString(),
          end_time: selectedDate 
            ? `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTimeSlot?.split(':')[0]}:59:00` 
            : new Date().toISOString(),
          status: 'pending_payment_confirmation'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          consultant_id: selectedConsultant.id,
          session_id: session.id,
          amount: selectedConsultant.hourly_rate,
          payment_method: 'paypal',
          status: 'pending_confirmation',
          description: `Session with ${selectedConsultant.name} on ${format(selectedDate!, 'MMM d, yyyy')} at ${selectedTimeSlot}`
        });
        
      if (transactionError) {
        console.error("Transaction error:", transactionError);
      }
      
      await findOrCreateChatThread(selectedConsultant.id, user.id);
      
      toast({
        title: "Session Booked!",
        description: `Your session with ${selectedConsultant.name} is pending payment confirmation. They will confirm once payment is received.`,
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setShowPayPalDialog(false);
    }
  };

  const startChat = async () => {
    if (!user || !selectedConsultant) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a chat",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const thread = await findOrCreateChatThread(selectedConsultant.id, user.id);
      navigate(`/chat/${thread.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error",
        description: "Could not start chat with consultant",
        variant: "destructive"
      });
    }
  };
  
  const renderConsultantSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map(consultant => (
          <Card key={consultant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleConsultantSelect(consultant)}>
            <div className="aspect-[3/2] overflow-hidden relative">
              <img 
                src={consultant.profile_image} 
                alt={consultant.name}
                className="w-full h-full object-cover"
              />
              {consultant.isOnline && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500">Online</Badge>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-xl font-bold">{consultant.name}</h3>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {consultant.specialization?.slice(0, 3).map(spec => (
                  <Badge key={spec} variant="outline" className="bg-mental-green-50 text-mental-green-800 border-mental-green-200">
                    {spec}
                  </Badge>
                ))}
              </div>
              
              <p className="text-sm line-clamp-2 text-gray-700 mb-4">{consultant.bio}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-mental-green-800">${consultant.hourly_rate}/hour</span>
                <Button size="sm">Select</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-mental-green-800 mb-2">Book a Paid Therapy Session</h1>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading consultants...</p>
          </div>
        ) : !selectedConsultant ? (
          renderConsultantSelection()
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={selectedConsultant.profile_image} 
                      alt={selectedConsultant.name} 
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-lg font-semibold">{selectedConsultant.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{selectedConsultant.location}</p>
                    {selectedConsultant.isOnline && (
                      <Badge className="bg-green-500 mb-2">Online Now</Badge>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <p className="text-sm text-gray-700 mb-4">{selectedConsultant.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedConsultant.specialization?.slice(0, 6).map(spec => (
                        <Badge key={spec} variant="outline" className="bg-mental-green-50 text-mental-green-800 border-mental-green-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Session Rate</span>
                      <span className="font-semibold text-mental-green-800">${selectedConsultant.hourly_rate}/hour</span>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSelectedConsultant(null);
                          setCurrentStep('consultant');
                        }}
                      >
                        Change Consultant
                      </Button>
                      
                      <Button 
                        variant="secondary" 
                        className="w-full"
                        onClick={startChat}
                      >
                        Chat with Consultant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              <Tabs defaultValue="date" value={currentStep}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="date" disabled={currentStep !== 'date'}>1. Select Date</TabsTrigger>
                  <TabsTrigger value="time" disabled={currentStep !== 'time'}>2. Select Time</TabsTrigger>
                  <TabsTrigger value="payment" disabled={currentStep !== 'payment'}>3. Payment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="date" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="mx-auto pointer-events-auto"
                        disabled={date => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">Please select a date to see available time slots</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="time" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="mb-4 font-medium">Available times for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}</p>
                      
                      {selectedDate && getAvailableSlots(selectedDate).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {getAvailableSlots(selectedDate).map(time => (
                            <Button 
                              key={time} 
                              variant={selectedTimeSlot === time ? "default" : "outline"} 
                              onClick={() => handleTimeSelect(time)}
                              className="w-full"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500">No available slots for this date</p>
                      )}
                      
                      <div className="mt-6 flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentStep('date')}>
                          Back
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payment" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Session with {selectedConsultant.name}</span>
                          <span>${selectedConsultant.hourly_rate}.00</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Platform fee (4%)</span>
                          <span>${(selectedConsultant.hourly_rate * 0.04).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-medium">
                          <span>Total</span>
                          <span>${(selectedConsultant.hourly_rate * 1.04).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg mb-6">
                        <p className="text-sm text-blue-800">
                          You're booking a paid therapy session with {selectedConsultant.name} on {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTimeSlot}.
                        </p>
                      </div>
                      
                      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
                        <Button variant="outline" onClick={() => setCurrentStep('time')}>
                          Back
                        </Button>
                        <Button onClick={handlePayment} disabled={isProcessing} className="w-full sm:w-auto">
                          {isProcessing ? "Processing..." : "Pay with PayPal"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* PayPal Payment Dialog */}
      {selectedConsultant && (
        <PayPalPaymentDialog
          isOpen={showPayPalDialog}
          onClose={() => setShowPayPalDialog(false)}
          consultantName={selectedConsultant.name}
          consultantEmail={selectedConsultant.email}
          amount={selectedConsultant.hourly_rate * 1.04}
          onPaymentComplete={handlePayPalPaymentComplete}
        />
      )}
    </Layout>
  );
}

export default BookSessionPage;