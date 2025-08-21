// components/events/id/RegistrationButton.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from 'lucide-react';
import { Event, Attendance } from './types';

interface RegistrationButtonProps {
  event: Event;
  attendance: Attendance | null;
  attendanceLoading: boolean;
  onRegister: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onMarkAttended: () => void;
  isAuthenticated: boolean;
}

const RegistrationButton: React.FC<RegistrationButtonProps> = ({
  event,
  attendance,
  attendanceLoading,
  onRegister,
  onCancel,
  onConfirm,
  onMarkAttended,
  isAuthenticated,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const now = new Date();
  const eventStartDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);

  const renderButton = () => {
    // Past event
    if (eventEndDate < now) {
      return (
        <Button className="w-full" disabled variant="outline">
          Event Ended
        </Button>
      );
    }

    // Session loading
    if (status === 'loading') {
      return (
        <Button className="w-full" disabled>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </Button>
      );
    }

    // Not logged in
    if (!session || !isAuthenticated) {
      return (
        <Button 
          className="w-full" 
          onClick={() => router.push('/signin')}
        >
          Sign in to Register
        </Button>
      );
    }

    // Already registered
    if (attendance?.isRegistered) {
      return (
        <div className="flex flex-col gap-2">
          <Button className="w-full" disabled variant="outline">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Registered
          </Button>
          {attendance?.status !== 'CONFIRMED' && (
            <Button
              className="w-full"
              variant="default"
              onClick={onConfirm}
              disabled={attendanceLoading}
            >
              Confirm Attendance
            </Button>
          )}
          {eventEndDate < now && attendance?.status !== 'ATTENDED' && (
            <Button
              className="w-full"
              variant="secondary"
              onClick={onMarkAttended}
              disabled={attendanceLoading}
            >
              Mark as Attended
            </Button>
          )}
          <Button
            className="w-full"
            variant="destructive"
            onClick={onCancel}
            disabled={attendanceLoading}
          >
            Cancel Registration
          </Button>
        </div>
      );
    }

    // Can register
    const isOngoing = eventStartDate <= now && eventEndDate >= now;
    return (
      <Button 
        className="w-full" 
        onClick={onRegister}
        disabled={attendanceLoading}
      >
        {attendanceLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isOngoing ? 'Join Ongoing Event' : 'Register for Event'}
      </Button>
    );
  };

  return (
    <Card className="border-0 bg-muted/20 registration-button">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Ready to Join?
          </h2>
          <p className="text-sm text-muted-foreground">
            {eventEndDate < now 
              ? 'This event has ended'
              : attendance?.isRegistered 
                ? 'You are registered for this event'
                : !isAuthenticated
                  ? 'Sign in to register for this event'
                  : 'Register now to secure your spot'
            }
          </p>
        </div>
        {renderButton()}
      </CardContent>

      <style jsx>{`
        .registration-button {
          animation: slideUp 0.8s ease-out 1.8s both;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
};

export default RegistrationButton;