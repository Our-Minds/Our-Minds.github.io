
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface DaySchedule {
  date: string;
  day: string;
  slots: Array<{ time: string; available: boolean }>;
}

interface DateSelectorProps {
  schedule: DaySchedule[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function DateSelector({ schedule, selectedDate, onDateSelect }: DateSelectorProps) {
  return (
    <Card className="bg-white dark:bg-[#212121] border-gray-200 dark:border-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base text-gray-900 dark:text-gray-100">
          <Calendar className="w-4 h-4 mr-2 text-mental-green-600 dark:text-[#025803]" />
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {schedule.map((day) => (
            <button
              key={day.date}
              onClick={() => onDateSelect(day.date)}
              className={`
                p-2 rounded-lg border-2 transition-all text-center
                ${selectedDate === day.date 
                  ? 'border-mental-green-600 dark:border-[#025803] bg-mental-green-50 dark:bg-[#1a1a1a] text-mental-green-700 dark:text-[#025803]' 
                  : 'border-gray-200 dark:border-[#1a1a1a] hover:border-mental-green-300 dark:hover:border-[#025803] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                }
              `}
            >
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-0.5">
                {day.day.split(' ')[0]}
              </div>
              <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                {day.day.split(' ').slice(1).join(' ')}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
