interface Ticket {
  id: string;
  ticketNumber: string;
  qrCode: string;
  status: string;
  purchaseDate: string;
  event: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    logo: string;
  };
  payment?: {
    amount: number;
    currency: string;
    status: string;
  } | null;
}

import React, { useEffect, useState, ReactElement } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Calendar, MapPin, Download, QrCode, Clock, ExternalLink, Ticket as TicketIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
// import { cn } from '@/lib/utils';

// ... (Interface Ticket remains the same)

const TicketsDashboard = () => {
  const { status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    if (status === 'authenticated') fetchTickets();
  }, [status, router]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = (ticket: Ticket) => {
    if (!ticket.qrCode) return;
    const link = document.createElement('a');
    link.href = ticket.qrCode;
    link.download = `ticket-${ticket.ticketNumber}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-64 w-full bg-muted rounded-xl" />
        <div className="h-64 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-muted-foreground mt-1">Access your QR codes and event entry details.</p>
      </div>

      {tickets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <TicketIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No tickets found</h3>
            <p className="text-muted-foreground text-center max-w-sm mt-2 mb-6">
              Ready for your next adventure? Browse our upcoming events to secure your spot.
            </p>
            <Button onClick={() => router.push('/events')}>Browse Events</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => {
            const startDate = new Date(ticket.event.startDate);
            const isUpcoming = startDate > new Date();

            return (
              <Card key={ticket.id} className="group overflow-hidden border-l-4 border-l-primary">
                <div className="flex flex-col md:flex-row">
                  {/* Left Section: Event Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant={ticket.status === 'ACTIVE' ? 'default' : 'secondary'} className="mb-2 uppercase tracking-wider text-[10px]">
                          {ticket.status}
                        </Badge>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/events/${ticket.event.id}`)}>
                          {ticket.event.title}
                        </CardTitle>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{ticket.event.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push(`/events/${ticket.event.id}`)}>
                        <ExternalLink className="w-3.5 h-3.5" /> Event Info
                      </Button>
                      {isUpcoming && ticket.status === 'ACTIVE' && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                          Ready for entry
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Section: QR / Ticket Stub Effect */}
                  <div className="md:w-64 bg-muted/30 border-t md:border-t-0 md:border-l border-dashed p-6 flex flex-col items-center justify-center relative">
                    {/* Decorative Cutouts for "Ticket Stub" look */}
                    <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 bg-background rounded-full border shadow-[inset_0_-1px_0_rgba(0,0,0,0.1)]" />
                    <div className="hidden md:block absolute -bottom-3 -left-3 w-6 h-6 bg-background rounded-full border shadow-[inset_0_1px_0_rgba(0,0,0,0.1)]" />

                    {ticket.qrCode ? (
                      <div className="text-center space-y-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                          <Image src={ticket.qrCode} alt="Entry QR" width={128} height={128} className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                          #{ticket.ticketNumber}
                        </p>
                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-2" onClick={() => downloadTicket(ticket)}>
                          <Download className="w-3 h-3" /> Save Image
                        </Button>
                      </div>
                    ) : (
                      <QrCode className="w-12 h-12 text-muted/50" />
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

TicketsDashboard.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default TicketsDashboard;