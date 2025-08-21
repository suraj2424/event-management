'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import toast from 'react-hot-toast';

import EventHeader from './EventHeader';
import EventBanner from './EventBanner';
import EventInfo from './EventInfo';
import RegistrationButton from './RegistrationButton';
import PhotoModal from './PhotoModal';
import { Event, EventDetails, Attendance } from './types';

interface EventDetailClientProps {
  event: Event;
  eventDetails: EventDetails;
  attendance: Attendance | null;
  eventId: string;
  isAuthenticated: boolean;
}

const EventDetailClient: React.FC<EventDetailClientProps> = ({
  event,
  eventDetails,
  attendance: initialAttendance,
  eventId,
  isAuthenticated,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(initialAttendance);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleRegister = async () => {
    if (!session) {
      // This shouldn't happen if RegistrationButton is working correctly
      return;
    }

    setAttendanceLoading(true);
    setError(null);

    // Optimistic update
    const prevAttendance = attendance;
    setAttendance({ isRegistered: true, status: 'REGISTERED' });

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    try {
      const response = await fetch(`${url}/api/events/${eventId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Roll back optimistic update
        setAttendance(prevAttendance);
        if ((response as any).status === 409) {
          throw new Error(errorData.message || 'Event is at full capacity');
        }
        throw new Error(errorData.message || 'Failed to register for event');
      }

      const data = await response.json();
      const att = data?.attendance;
      setAttendance(att
        ? { isRegistered: true, status: att.status || 'REGISTERED' }
        : { isRegistered: true, status: 'REGISTERED' }
      );
      
      toast.success('Successfully registered for event!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register for event';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleMarkAttended = async () => {
    if (!session) return;

    setAttendanceLoading(true);
    setError(null);

    // Optimistic update
    const prevAttendance = attendance;
    setAttendance({ isRegistered: true, status: 'ATTENDED' });

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${url}/api/events/${eventId}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ATTENDED' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Roll back
        setAttendance(prevAttendance);
        throw new Error(errorData.message || 'Failed to mark attendance');
      }

      const data = await response.json();
      const att = data?.attendance;
      setAttendance(att
        ? { isRegistered: true, status: att.status || 'ATTENDED' }
        : { isRegistered: true, status: 'ATTENDED' }
      );
      toast.success('Marked as attended');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark attendance';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!session) return;

    setAttendanceLoading(true);
    setError(null);

    // Optimistic update
    const prevAttendance = attendance;
    setAttendance({ isRegistered: true, status: 'CONFIRMED' });

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${url}/api/events/${eventId}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Roll back
        setAttendance(prevAttendance);
        throw new Error(errorData.message || 'Failed to confirm attendance');
      }

      const data = await response.json();
      const att = data?.attendance;
      setAttendance(att
        ? { isRegistered: true, status: att.status || 'CONFIRMED' }
        : { isRegistered: true, status: 'CONFIRMED' }
      );
      toast.success('Attendance confirmed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to confirm attendance';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!session) return;

    setAttendanceLoading(true);
    setError(null);

    // Optimistic update
    const prevAttendance = attendance;
    setAttendance(null);

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${url}/api/events/${eventId}/attendance`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Roll back
        setAttendance(prevAttendance);
        throw new Error(errorData.message || 'Failed to cancel registration');
      }

      // Clear local attendance state
      setAttendance(null);
      toast.success('Registration cancelled');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel registration';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAttendanceLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <EventHeader />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <EventBanner event={event} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <EventInfo event={event} onPhotoClick={setSelectedPhoto} guests={eventDetails.specialGuests} socialLinks={eventDetails.socialLinks}/>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-14">
              <RegistrationButton
                event={event}
                attendance={attendance}
                attendanceLoading={attendanceLoading}
                onRegister={handleRegister}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                onMarkAttended={handleMarkAttended}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>

        <PhotoModal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      </div>
    </div>
  );
};

export default EventDetailClient;