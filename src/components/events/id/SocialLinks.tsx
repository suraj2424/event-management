// components/events/id/SocialLinks.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { SocialLinks as SocialLinksType } from './types';

interface SocialLinksProps {
  socialLinks: SocialLinksType;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks }) => {
  

  return (
    <Card className="mb-8 border-0 bg-background social-links">
      <CardContent className="p-6">
        
      </CardContent>

      <style jsx>{`
        .social-links {
          animation: slideUp 0.8s ease-out 1.6s both;
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

export default SocialLinks;