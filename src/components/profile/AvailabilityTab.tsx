
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock } from 'lucide-react';
import { ConsultantAvailability } from '@/utils/consultantTypes';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export function AvailabilityTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availability, setAvailability] = useState<ConsultantAvailability[]>(
    DAYS_OF_WEEK.map(day => ({ day, slots: [] }))
  );
  
  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get consultant availability status
      const { data: consultantData, error: consultantError } = await supabase
        .from('consultants')
        .select('available')
        .eq('id', user.id)
        .single();
      
      if (consultantError) throw consultantError;
      
      setIsAvailable(consultantData?.available || false);
      
      // Get availability schedule
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', user.id);
      
      if (availabilityError) throw availabilityError;
      
      // Convert database format to UI format
      const weeklyAvailability = DAYS_OF_WEEK.map((day, index) => {
        const daySlots = availabilityData
          ?.filter(slot => slot.day_of_week === index + 1) // Database uses 1-7, we use 0-6
          ?.map(slot => slot.start_time.substring(0, 5)) || []; // Extract HH:MM from HH:MM:SS
        
        return { day, slots: daySlots };
      });
      
      setAvailability(weeklyAvailability);
    } catch (error: any) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error fetching availability",
        description: error.message || "Could not load your availability settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvailabilityToggle = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newAvailability = !isAvailable;
      
      const { error } = await supabase
        .from('consultants')
        .update({ available: newAvailability })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsAvailable(newAvailability);
      
      toast({
        title: newAvailability ? "You are now available" : "You are now unavailable",
        description: newAvailability 
          ? "Clients can now book sessions with you." 
          : "You won't receive new booking requests."
      });
    } catch (error: any) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error updating availability",
        description: error.message || "Could not update your availability status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSlotToggle = (day: string, timeSlot: string) => {
    setAvailability(prev => 
      prev.map(dayItem => {
        if (dayItem.day !== day) return dayItem;
        
        const existingSlots = new Set(dayItem.slots);
        if (existingSlots.has(timeSlot)) {
          existingSlots.delete(timeSlot);
        } else {
          existingSlots.add(timeSlot);
        }
        
        return {
          ...dayItem,
          slots: Array.from(existingSlots)
        };
      })
    );
  };
  
  const handleSaveAvailability = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First, delete existing availability for this consultant
      const { error: deleteError } = await supabase
        .from('consultant_availability')
        .delete()
        .eq('consultant_id', user.id);
      
      if (deleteError) throw deleteError;
      
      // Then insert new availability
      const availabilityRecords = [];
      
      for (const dayAvailability of availability) {
        const dayIndex = DAYS_OF_WEEK.indexOf(dayAvailability.day) + 1; // Database uses 1-7
        
        for (const timeSlot of dayAvailability.slots) {
          // Create end time (1 hour after start time)
          const [hours, minutes] = timeSlot.split(':').map(Number);
          const endHours = hours + 1;
          const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
          
          availabilityRecords.push({
            consultant_id: user.id,
            day_of_week: dayIndex,
            start_time: `${timeSlot}:00`,
            end_time: endTime
          });
        }
      }
      
      if (availabilityRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('consultant_availability')
          .insert(availabilityRecords);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Availability updated",
        description: "Your availability schedule has been saved successfully."
      });
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error saving availability",
        description: error.message || "Could not save your availability schedule.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Availability Status</CardTitle>
          <CardDescription>
            Toggle your availability to receive booking requests from clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Switch 
              id="availability-mode"
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
              disabled={isLoading}
            />
            <Label htmlFor="availability-mode" className="text-base">
              {isAvailable ? "Available for bookings" : "Not available for bookings"}
            </Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              Configure your available time slots for each day of the week.
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={fetchAvailability}
              disabled={isLoading}
            >
              <Clock className="mr-1 h-4 w-4" />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button
              size="sm"
              className="flex items-center"
              onClick={handleSaveAvailability}
              disabled={isLoading}
            >
              <Calendar className="mr-1 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Schedule'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {availability.map((dayAvailability) => (
              <div key={dayAvailability.day}>
                <h3 className="font-medium mb-2">{dayAvailability.day}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {TIME_SLOTS.map(timeSlot => (
                    <div key={`${dayAvailability.day}-${timeSlot}`} className="flex items-center space-x-2 border rounded p-2">
                      <Checkbox 
                        id={`${dayAvailability.day}-${timeSlot}`}
                        checked={dayAvailability.slots.includes(timeSlot)}
                        onCheckedChange={() => handleSlotToggle(dayAvailability.day, timeSlot)}
                        disabled={isLoading}
                      />
                      <label 
                        htmlFor={`${dayAvailability.day}-${timeSlot}`}
                        className="text-sm cursor-pointer"
                      >
                        {timeSlot}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AvailabilityTab;
