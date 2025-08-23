import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Download, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    location: string;
    logo: string;
  };
}

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      fetchTicketDetails();
    }
  }, [session_id]);

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        // Get the most recent ticket (just purchased)
        if (data.tickets && data.tickets.length > 0) {
          setTicket(data.tickets[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    if (ticket?.qrCode) {
      const link = document.createElement('a');
      link.href = ticket.qrCode;
      link.download = `ticket-${ticket.ticketNumber}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">Your ticket has been generated and is ready to use.</p>
        </div>

        {ticket && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {ticket.event.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{ticket.event.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(ticket.event.startDate).toLocaleDateString()}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">Ticket Number</p>
                    <p className="text-muted-foreground">{ticket.ticketNumber}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {ticket.status}
                  </Badge>
                </div>

                {ticket.qrCode && (
                  <div className="text-center">
                    <img 
                      src={ticket.qrCode} 
                      alt="QR Code" 
                      className="w-32 h-32 mx-auto mb-4 border rounded"
                    />
                    <Button onClick={downloadTicket} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/dashboard/tickets')}>
            View All Tickets
          </Button>
          <Button variant="outline" onClick={() => router.push('/events')}>
            Browse More Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
