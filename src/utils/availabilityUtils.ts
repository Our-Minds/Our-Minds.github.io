
import { ConsultantAvailabilityRecord, ConsultantAvailability } from './consultantTypes';
import { format, parse } from 'date-fns';

/**
 * Converts day of week number to day name
 */
export const getDayNameFromNumber = (dayNum: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNum] || 'Unknown';
};

/**
 * Formats database availability records into a structured format for the UI
 */
export const formatConsultantAvailability = (
  records: ConsultantAvailabilityRecord[]
): ConsultantAvailability[] => {
  // Group by day of week
  const availabilityByDay: Record<string, string[]> = {};
  
  records.forEach(record => {
    const dayName = getDayNameFromNumber(record.day_of_week);
    
    if (!availabilityByDay[dayName]) {
      availabilityByDay[dayName] = [];
    }
    
    // Format the time to show in standard format (e.g. "09:00")
    try {
      const startTime = format(parse(record.start_time, 'HH:mm:ss', new Date()), 'HH:mm');
      availabilityByDay[dayName].push(startTime);
    } catch (error) {
      console.error(`Error parsing time ${record.start_time}:`, error);
    }
  });
  
  // Convert to array format
  return Object.entries(availabilityByDay).map(([day, slots]) => ({
    day,
    slots: slots.sort() // Sort slots chronologically
  }));
};

/**
 * Checks if a consultant has availability on a specific date
 */
export const hasAvailabilityOnDate = (
  consultant: { availability: ConsultantAvailability[] },
  date: Date
): boolean => {
  const dayName = format(date, 'EEEE');
  return consultant.availability.some(a => a.day === dayName && a.slots.length > 0);
};

/**
 * Find the next available date for a consultant starting from today
 */
export const findNextAvailableDate = (
  consultant: { availability: ConsultantAvailability[] }
): Date | null => {
  const today = new Date();
  
  // Check next 30 days
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    
    if (hasAvailabilityOnDate(consultant, checkDate)) {
      return checkDate;
    }
  }
  
  return null; // No availability in the next 30 days
};
