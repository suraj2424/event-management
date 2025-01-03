import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, MapPin, Users, Clock, ArrowLeft, X, Facebook, Twitter, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

interface SpecialGuest {
  id: number;
  guestName: string;
  guestDescription: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  logo: string;
  location: string;
  capacity: number;
  status: string;
  photos: string[];
  contactEmail: string;
  contactPhone: string;
  hostName: string;
  hostDescription: string;
  organizer: { name: string; email: string };
}

interface EventDetails {
  specialGuests: SpecialGuest[];
  socialLinks: SocialLinks;
}

interface Attendance {
  status: string | null;
  isRegistered: boolean;
}

const EventDetailPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const [eventResponse, detailsResponse] = await Promise.all([
          fetch(`/api/events/${id}`),
          fetch(`/api/events/${id}/details`),
        ]);

        if (!eventResponse.ok || !detailsResponse.ok) {
          throw new Error('Failed to fetch event data');
        }

        const eventData = await eventResponse.json();
        const detailsData = await detailsResponse.json();

        setEvent(eventData);
        setEventDetails(detailsData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendanceData = async () => {
      if (!id || !session) return;
    
      try {
        const attendanceResponse = await fetch(`/api/events/${id}/attendance`);
        if (attendanceResponse.ok) {
          const attendanceData = await attendanceResponse.json();
          setAttendance({
            isRegistered: attendanceData.isRegistered,
            status: attendanceData.attendance?.status || null
          });
        } else if (attendanceResponse.status === 404) {
          setAttendance({ isRegistered: false, status: null });
        } else {
          console.error('Failed to fetch attendance status:', attendanceResponse.statusText);
          setAttendance({ isRegistered: false, status: null });
        }
      } catch (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
        setAttendance({ isRegistered: false, status: null });
      }
    };

    fetchEventData();
    fetchAttendanceData();
  }, [id, session]);

  const handleRegister = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to register for event');
      }
      toast.success('Successfully registered for event');
      window.location.reload();
      const newAttendance = await response.json();
      if (newAttendance && newAttendance.status) {
        setAttendance(newAttendance);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  

  const renderAttendanceButton = () => {
    if (!event) return null;
  
    const now = new Date();
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
  
    // Past event
    if (eventEndDate < now) {
      return (
        <Button className="mt-6 w-full" disabled>
          Event Ended
        </Button>
      );
    }
  
    // Not logged in
    if (!session) {
      return (
        <Button className="mt-6 w-full" onClick={() => router.push('/signin')}>
          Sign in to Register
        </Button>
      );
    }
  
    // Future event
    if (eventStartDate > now) {
      if (!attendance?.isRegistered) {
        return (
          <Button className="mt-6 w-full" onClick={handleRegister}>
            Register for Event
          </Button>
        );
      }
      return (
        <Button className="mt-6 w-full" disabled>
          Registered
        </Button>
      );
    }
  
    // Ongoing event
    if (eventStartDate <= now && eventEndDate >= now) {
      if (!attendance?.isRegistered) {
        return (
          <Button className="mt-6 w-full" onClick={handleRegister}>
            Register for Ongoing Event
          </Button>
        );
      }
      return (
        <Button className="mt-6 w-full" disabled>
          Registered
        </Button>
      );
    }
  
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
      <Button variant="ghost" className="mb-4">
        <Skeleton className="h-4 w-4 mr-2" /> <Skeleton className="h-4 w-24" />
      </Button>
      
      <Card className="overflow-hidden">
        <Skeleton className="h-64 w-full" />
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </div>
            ))}
            
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
            </div>
            
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

            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="flex space-x-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-6 w-6" />
              ))}
            </div>
          </div>
          
          <Skeleton className="h-10 w-full mt-6" />
        </CardContent>
      </Card>
    </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!event || !eventDetails) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <Alert>
          <AlertTitle>Event Not Found</AlertTitle>
          <AlertDescription>The requested event could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-8 px-4"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 hover:bg-gray-100">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>
      
      <Card className="overflow-hidden shadow-lg">
        {event.logo && (
          <div className="relative h-80 w-full">
            <Image
              src={event.logo}
              alt={`${event.title} logo`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
              <Badge className={`${
                event.status === "ONGOING" ? "bg-green-500" : 
                event.status === "UPCOMING" ? "bg-yellow-500" : "bg-red-500"
              } text-white uppercase px-3 py-1`}>
                {event.status}
              </Badge>
            </div>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{format(new Date(event.startDate), 'PPP')} - {format(new Date(event.endDate), 'PPP')}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{event.capacity} capacity</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>

          {/* Event Photos */}
          {event.photos && event.photos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Event Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.photos.map((photo, index) => (
                  <motion.div 
                    key={index} 
                    className="relative h-24 cursor-pointer rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <Image src={photo} alt={`Event photo ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Host</h3>
              <p className="text-sm font-medium">{event.hostName}</p>
              <p className="text-sm text-gray-600">{event.hostDescription}</p>
            </div>

            {/* Special Guests */}
            {eventDetails.specialGuests && eventDetails.specialGuests.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Special Guests</h3>
                {eventDetails.specialGuests.map((guest) => (
                  <div key={guest.id} className="mb-2">
                    <p className="text-sm font-medium">{guest.guestName}</p>
                    <p className="text-sm text-gray-600">{guest.guestDescription}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="text-sm">Email: {event.contactEmail}</p>
            <p className="text-sm">Phone: {event.contactPhone}</p>
          </div>
          
          {/* Social Links */}
          {eventDetails.socialLinks && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Social Media</h3>
              <div className="flex space-x-4">
                {eventDetails.socialLinks.facebook && (
                  <a href={eventDetails.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {eventDetails.socialLinks.twitter && (
                  <a href={eventDetails.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {eventDetails.socialLinks.instagram && (
                  <a href={eventDetails.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            {renderAttendanceButton()}
          </div>
        </CardContent>
        </Card>

      {/* Full-screen photo preview */}
      {selectedPhoto && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        >
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
            <Image 
              src={selectedPhoto} 
              alt="Full-screen preview" 
              fill 
              style={{ objectFit: 'contain' }} 
            />
            <Button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20"
              variant="ghost"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventDetailPage;