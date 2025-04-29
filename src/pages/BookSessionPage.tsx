import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { consultants } from '@/data/mockConsultants';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function BookSessionPage() {
  const { consultantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedConsultant, setSelectedConsultant] = useState<typeof consultants[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'consultant' | 'date' | 'time' | 'payment'>('consultant');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // If consultantId is provided, find that consultant
    if (consultantId) {
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
  }, [consultantId, navigate, toast]);
  
  const getAvailableSlots = (date: Date | undefined) => {
    if (!selectedConsultant || !date) return [];
    
    try {
      // Get day name (e.g. "Monday")
      const dayName = format(date, 'EEEE');
      
      // Find availability for that day
      const dayAvailability = selectedConsultant.availability.find(
        a => a.day === dayName
      );
      
      return dayAvailability ? dayAvailability.slots : [];
    } catch (error) {
      console.error("Error getting available slots:", error);
      return [];
    }
  };
  
  const handleConsultantSelect = (consultant: typeof consultants[0]) => {
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
    setIsProcessing(true);
    
    try {
      // Mock payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Session Booked!",
        description: `Your session with ${selectedConsultant?.name} is confirmed for ${format(selectedDate!, 'MMM d, yyyy')} at ${selectedTimeSlot}.`,
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderConsultantSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map(consultant => (
          <Card key={consultant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleConsultantSelect(consultant)}>
            <div className="aspect-[3/2] overflow-hidden relative">
              <img 
                src={consultant.profileImage} 
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
              <div className="flex items-center mb-3">
                <div className="flex items-center text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="ml-1 text-sm font-medium">{consultant.rating}</span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">{consultant.reviewCount} reviews</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {consultant.specialization.slice(0, 3).map(spec => (
                  <Badge key={spec} variant="outline" className="bg-mental-green-50 text-mental-green-800 border-mental-green-200">
                    {spec}
                  </Badge>
                ))}
              </div>
              
              <p className="text-sm line-clamp-2 text-gray-700 mb-4">{consultant.bio}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-mental-green-800">${consultant.hourlyRate}/hour</span>
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
          <p className="text-gray-600">
            Select a consultant and schedule a professional therapy session
          </p>
          <p className="text-sm text-mental-green-700 mt-1">
            All consultations are free, but therapy sessions have standard rates
          </p>
        </div>
        
        {!selectedConsultant ? (
          renderConsultantSelection()
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={selectedConsultant.profileImage} 
                      alt={selectedConsultant.name} 
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-lg font-semibold">{selectedConsultant.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{selectedConsultant.location}</p>
                    {selectedConsultant.isOnline && (
                      <Badge className="bg-green-500 mb-2">Online Now</Badge>
                    )}
                    <div className="flex items-center text-amber-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="ml-1 text-sm font-medium">{selectedConsultant.rating}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{selectedConsultant.reviewCount} reviews</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <p className="text-sm text-gray-700 mb-4">{selectedConsultant.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedConsultant.specialization.slice(0, 6).map(spec => (
                        <Badge key={spec} variant="outline" className="bg-mental-green-50 text-mental-green-800 border-mental-green-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Session Rate</span>
                      <span className="font-semibold text-mental-green-800">${selectedConsultant.hourlyRate}/hour</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedConsultant(null);
                        setCurrentStep('consultant');
                      }}
                    >
                      Change Consultant
                    </Button>
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
                          // Disable dates in the past
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
                          <span>${selectedConsultant.hourlyRate}.00</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Platform fee (4%)</span>
                          <span>${(selectedConsultant.hourlyRate * 0.04).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-medium">
                          <span>Total</span>
                          <span>${(selectedConsultant.hourlyRate * 1.04).toFixed(2)}</span>
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
    </Layout>
  );
}

export default BookSessionPage;
