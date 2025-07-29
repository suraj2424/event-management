// components/events/EventsLoadingSkeleton.tsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface EventsLoadingSkeletonProps {
  count?: number;
}

const EventsLoadingSkeleton: React.FC<EventsLoadingSkeletonProps> = ({ 
  count = 9 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {[...Array(count)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-4/5" />
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsLoadingSkeleton;