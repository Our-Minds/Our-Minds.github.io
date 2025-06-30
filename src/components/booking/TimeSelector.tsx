
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface SessionSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  day: string;
  slots: SessionSlot[];
}

interface TimeSelectorProps {
  schedule: DaySchedule[];
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export function TimeSelector({ schedule, selectedDate, selectedTime, onTimeSelect }: TimeSelectorProps) {
  const selectedDay = schedule.find(day => day.date === selectedDate);
  
  if (!selectedDay) return null;

  return (
    <Card className="bg-white dark:bg-[#212121] border-gray-200 dark:border-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base text-gray-900 dark:text-gray-100">
          <Clock className="w-4 h-4 mr-2 text-mental-green-600 dark:text-[#025803]" />
          Select Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {selectedDay.slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={`
                p-2 rounded-lg border-2 transition-all text-center
                ${!slot.available 
                  ? 'border-gray-200 dark:border-[#1a1a1a] bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : selectedTime === slot.time 
                    ? 'border-mental-green-600 dark:border-[#025803] bg-mental-green-50 dark:bg-[#1a1a1a] text-mental-green-700 dark:text-[#025803]' 
                    : 'border-gray-200 dark:border-[#1a1a1a] hover:border-mental-green-300 dark:hover:border-[#025803] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                }
              `}
            >
              <div className="text-xs font-medium">{slot.time}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {slot.available ? 'Available' : 'Booked'}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
