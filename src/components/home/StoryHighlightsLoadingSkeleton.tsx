
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

export function StoryHighlightsLoadingSkeleton() {
  return (
    <div className="bg-gray-100 dark:bg-[#212121] rounded-3xl border border-gray-200 dark:border-[#3a3a3a] shadow-sm h-full overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-br from-[#025803]/10 to-[#025803]/20 dark:from-[#025803]/20 dark:to-[#025803]/30 rounded-xl">
            <TrendingUp className="w-5 h-5 text-[#025803] dark:text-[#037004]" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-[#3a3a3a]" />
            <Skeleton className="h-3 w-48 bg-gray-200 dark:bg-[#3a3a3a]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-4 rounded-lg bg-gray-200 dark:bg-[#3a3a3a]" />
      </div>
      
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden border border-gray-200 dark:border-[#3a3a3a] shadow-md bg-white dark:bg-[#2a2a2a] rounded-2xl">
            <Skeleton className="w-full h-48 rounded-t-2xl bg-gray-200 dark:bg-[#3a3a3a]" />
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-20 rounded-full bg-gray-200 dark:bg-[#3a3a3a]" />
                  <Skeleton className="h-6 w-full bg-gray-200 dark:bg-[#3a3a3a]" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-[#3a3a3a]" />
                  <Skeleton className="h-4 w-4/6 bg-gray-200 dark:bg-[#3a3a3a]" />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#3a3a3a]" />
                    <div className="space-y-1">
                      <Skeleton className="w-24 h-4 bg-gray-200 dark:bg-[#3a3a3a]" />
                      <Skeleton className="w-16 h-3 bg-gray-200 dark:bg-[#3a3a3a]" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#3a3a3a]" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
