// components/events/id/SpecialGuests.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { SpecialGuest } from './types';

interface SpecialGuestsProps {
  guests: SpecialGuest[];
}

const SpecialGuests: React.FC<SpecialGuestsProps> = ({ guests }) => {
  

  return (
    <Card className="mb-8 border-0 bg-background special-guests">
      <CardContent className="p-6">
        
      </CardContent>

      <style jsx>{`
        .special-guests {
          animation: slideUp 0.8s ease-out 1.2s both;
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

export default SpecialGuests;