
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circular';
}

export function LoadingSkeleton({ 
  className, 
  variant = 'default' 
}: LoadingSkeletonProps) {
  const variants = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-lg",
    text: "h-3 w-3/4",
    circular: "h-10 w-10 rounded-full"
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded",
        variants[variant],
        className
      )}
    />
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <LoadingSkeleton variant="card" />
      <div className="space-y-3">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" className="w-1/2" />
        <LoadingSkeleton variant="text" className="w-2/3" />
      </div>
    </div>
  );
}
