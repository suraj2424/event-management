// components/events/id/ContactInfo.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Event } from './types';

interface ContactInfoProps {
  event: Event;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ event }) => {
  

  return (
    <Card className="mb-8 border-0 bg-muted/20 contact-info">
      <CardContent className="p-6">
        
      </CardContent>

      <style jsx>{`
        .contact-info {
          animation: slideUp 0.8s ease-out 1.4s both;
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

export default ContactInfo;