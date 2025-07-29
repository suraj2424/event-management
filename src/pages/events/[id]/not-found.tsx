import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function EventNotFound() {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>
      </Button>
      
      <Alert className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-slate-300">
          <Calendar className="w-full h-full" />
        </div>
        <AlertTitle className="text-xl mb-2">Event Not Found</AlertTitle>
        <AlertDescription className="text-base mb-6">
          The event you're looking for doesn't exist or may have been removed.
        </AlertDescription>
        <Button asChild>
          <Link href="/events">
            Browse All Events
          </Link>
        </Button>
      </Alert>
    </div>
  );
}