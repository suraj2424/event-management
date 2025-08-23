import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Calendar, MapPin, Download, QrCode, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

const TicketsDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchTickets();
    }
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
    if (ticket.qrCode) {
      const link = document.createElement('a');
      link.href = ticket.qrCode;
      link.download = `ticket-${ticket.ticketNumber}.png`;
      link.click();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'USED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tickets</h1>
          <p className="text-muted-foreground">Manage and view all your event tickets</p>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't purchased any tickets yet. Browse events to get started!
              </p>
              <Button onClick={() => router.push('/events')}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{ticket.event.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(ticket.event.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{ticket.event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(ticket.event.startDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      {isEventUpcoming(ticket.event.startDate) && (
                        <Badge variant="outline">Upcoming</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Ticket Number</p>
                        <p className="font-mono text-sm">{ticket.ticketNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                        <p className="text-sm">{new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                        <p className="text-sm font-semibold">
                          {ticket.payment ? (
                            <>
                              {ticket.payment.currency} {ticket.payment.amount}
                            </>
                          ) : (
                            'Free'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      {ticket.qrCode && (
                        <div className="text-center">
                          <img 
                            src={ticket.qrCode} 
                            alt="QR Code" 
                            className="w-24 h-24 mx-auto mb-3 border rounded"
                          />
                          <Button 
                            onClick={() => downloadTicket(ticket)}
                            variant="outline" 
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download QR
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/events/${ticket.event.id}`)}
                    >
                      View Event Details
                    </Button>
                    
                    {isEventUpcoming(ticket.event.startDate) && ticket.status === 'ACTIVE' && (
                      <div className="text-sm text-green-600 font-medium">
                        Ready for event entry
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsDashboard;
