// components/events/id/EventInfo.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star, User, Users, Mail, Phone, Twitter, Facebook, Instagram } from "lucide-react";

import { format } from "date-fns";
import { Event, SpecialGuest, SocialLinks as SocialLinksType } from "./types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EventInfoProps {
  event: Event;
  onPhotoClick: (photo: string) => void;
  guests: SpecialGuest[];
  socialLinks: SocialLinksType;
}

const EventInfo: React.FC<EventInfoProps> = ({
  event,
  onPhotoClick,
  guests,
  socialLinks
}) => {
  if (!guests || guests.length === 0) return null;

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return "Date TBA";
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      return format(new Date(dateString), "p");
    } catch {
      return "Time TBA";
    }
  };

  const formatPrice = (price?: number, currency: string = 'USD') => {
    if (price == null || price <= 0) return 'Free';
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(price);
    } catch {
      return `${price} ${currency}`;
    }
  };

  const links = [
    {
      platform: 'Facebook',
      icon: Facebook,
      url: socialLinks.facebook,
      color: 'hover:text-blue-600',
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      url: socialLinks.twitter,
      color: 'hover:text-blue-400',
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      url: socialLinks.instagram,
      color: 'hover:text-pink-600',
    },
  ].filter(link => link.url);

  if (links.length === 0) return null;

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: event.contactEmail,
      href: `mailto:${event.contactEmail}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: event.contactPhone,
      href: `tel:${event.contactPhone}`,
    },
  ].filter((item) => item.value);

  if (contactItems.length === 0) return null;

  const infoItems = [
    {
      icon: Calendar,
      label: "Date",
      value: `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`,
    },
    {
      icon: Clock,
      label: "Time",
      value: `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: event.location || "Location TBA",
    },
    {
      icon: Users,
      label: "Capacity",
      value: `${event.capacity?.toLocaleString() || "TBA"} attendees`,
    },
    {
      icon: Star,
      label: "Price",
      value: formatPrice(event.price, event.currency || 'USD'),
    },
  ];

  return (
    <Card className="mb-8 border-0 bg-muted/20 event-info">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Event Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/60">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-foreground my-4">
          About This Event
        </h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground my-4">
          Event Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {event.photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer rounded overflow-hidden bg-muted/30 group"
              onClick={() => onPhotoClick(photo)}
            >
              <Image
                src={photo}
                alt={`Event photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-foreground my-4">
          Event Host
        </h2>
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background/60">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-2">
              {event.hostName}
            </h3>
            {event.hostDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.hostDescription}
              </p>
            )}
          </div>
        </div>
        <h2 className="text-lg font-semibold text-foreground my-4">
          Special Guests
        </h2>
        <div className="space-y-4">
          {guests.map((guest) => (
            <div key={guest.id} className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                <Star className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">
                  {guest.guestName}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {guest.guestDescription}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-foreground my-4">
          Contact Information
        </h2>
        <div className="space-y-3">
          {contactItems.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/60">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <a
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {value}
                </a>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-foreground my-4">
                  Follow Us
                </h2>
                <div className="flex gap-3">
                  {links.map(({ platform, icon: Icon, url, color }) => (
                    <Button
                      key={platform}
                      variant="outline"
                      size="icon"
                      className={`hover:bg-muted transition-all duration-200 ${color}`}
                      asChild
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow on ${platform}`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    </Button>
                  ))}
                </div>
      </CardContent>

      <style jsx>{`
        .event-info {
          animation: slideUp 0.8s ease-out 0.4s both;
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

export default EventInfo;
