import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <Button variant="ghost" className="mb-4" disabled>
        <Skeleton className="h-4 w-4 mr-2" /> 
        <Skeleton className="h-4 w-24" />
      </Button>
      
      <Card className="overflow-hidden">
        <Skeleton className="h-80 w-full" />
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </div>
              ))}
            </div>

            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="mt-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              {[...Array(2)].map((_, index) => (
                <div key={index} className="mb-2">
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="mt-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="flex space-x-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-6 w-6" />
              ))}
            </div>
          </div>
          
          <Skeleton className="h-10 w-full mt-8" />
        </CardContent>
      </Card>
    </div>
  );
}