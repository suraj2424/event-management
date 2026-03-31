'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Share2, ArrowLeft, Loader2, XCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import toast from 'react-hot-toast';

const EventDetailClient = ({ event, attendance: initialAttendance, isAuthenticated }: any) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [attendance, setAttendance] = useState(initialAttendance);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const eventId = Number(event.id);

  const handleAction = async (method: string, body?: any) => {
    if (!isAuthenticated) return router.push('/auth/signin');
    
    setLoading(true);
    const prevAttendance = attendance;

    try {
      const res = await fetch(`/api/events/${eventId}/attendance`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      const data = await res.json();
      
      if (method === 'DELETE') {
        setAttendance(null);
        toast.success('Registration cancelled');
      } else {
        setAttendance({ 
          isRegistered: true, 
          status: data.attendance?.status || (body?.status ?? 'REGISTERED') 
        });
        toast.success('Attendance updated');
      }
      
      // router.refresh is better than reload() in Next 13+ as it preserves client state
      router.reload(); 
    } catch (error: any) {
      setAttendance(prevAttendance);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getButtonConfig = () => {
    if (!attendance?.isRegistered) {
      return { text: 'Secure Your Spot', action: () => handleAction('POST'), variant: 'bg-background text-foreground' };
    }
    switch (attendance.status) {
      case 'REGISTERED':
        return { text: 'Cancel Registration', action: () => handleAction('DELETE'), variant: 'bg-red-500/10 text-red-500 border border-red-500/20' };
      case 'CONFIRMED':
        return { text: 'Mark as Attended', action: () => handleAction('PATCH', { status: 'ATTENDED' }), variant: 'bg-green-500 text-white' };
      default:
        return { text: 'Already Registered', action: null, variant: 'bg-muted text-muted-foreground' };
    }
  };

  const button = getButtonConfig();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Lightbox - Fixed for Next/Image */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-10 right-10 text-foreground/50 hover:text-foreground z-[110]">
            <XCircle className="w-10 h-10" />
          </button>
          
          <div className="relative w-full h-[80vh] max-w-5xl">
            <Image 
              src={selectedPhoto} 
              alt="Preview" 
              fill 
              priority
              className="object-contain rounded-[2rem]" 
              sizes="(max-width: 1280px) 100vw, 1280px"
              unoptimized // If images are from an external source like Cloudinary/S3 without local optimization
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative pt-32 pb-20 border-b border-foreground/5">
        <div className="container max-w-7xl mx-auto px-4">
          <Link href="/events" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground mb-12">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Discover
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  {event.status}
                </span>
                {attendance?.isRegistered && (
                  <span className="bg-foreground/5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-foreground/10">
                    My Status: {attendance.status}
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8">
                {event.title}
              </h1>
            </div>

            {/* Registration Card */}
            <div className="sticky top-32 bg-foreground text-background p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <p className="text-3xl font-black italic">{event.price > 0 ? `${event.currency} ${event.price}` : 'FREE ENTRY'}</p>
                <Share2 className="w-5 h-5 opacity-50 cursor-pointer" />
              </div>
              <button 
                onClick={() => button.action?.()}
                disabled={loading || !button.action}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${button.variant}`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {button.text}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2">
            {/* Gallery Fix */}
            {event.photos?.length > 0 && (
              <div className="mb-20">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-10">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.photos.map((photo: string, i: number) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(photo)}
                      className="aspect-square bg-foreground/5 rounded-3xl overflow-hidden cursor-pointer group relative"
                    >
                      <Image 
                        src={photo} 
                        alt="" 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            {/* User Profile Info - AUTH VISUAL */}
            {session && (
              <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <UserCheck className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Authenticated</p>
                </div>
                <p className="font-bold text-sm italic">{session.user.name || session.user.email}</p>
                <p className="text-[10px] uppercase opacity-50 font-bold">{session.user.role} Account</p>
              </div>
            )}

            <div className="p-8 rounded-[2rem] bg-foreground/[0.02] border border-foreground/5">
              <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-6">Host</h2>
              <p className="font-black italic text-xl uppercase mb-1">{event.hostName}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{event.hostDescription}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetailClient;