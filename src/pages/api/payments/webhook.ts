import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe-server';
import { PrismaClient } from '@prisma/client';
import { buffer } from 'micro';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateTicketNumber = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TKT-${timestamp}-${random}`.toUpperCase();
};

const generateQRCode = async (ticketId: string, eventId: number): Promise<string> => {
  const qrData = JSON.stringify({
    ticketId,
    eventId,
    timestamp: Date.now(),
  });
  
  return await QRCode.toDataURL(qrData);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const { eventId, userId, paymentId } = session.metadata!;

        // Update payment status
        await prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'COMPLETED' }
        });

        // Generate ticket
        const ticketNumber = generateTicketNumber();
        const ticket = await prisma.ticket.create({
          data: {
            ticketNumber,
            userId,
            eventId: parseInt(eventId),
            paymentId,
            status: 'ACTIVE',
          }
        });

        // Generate QR code
        const qrCode = await generateQRCode(ticket.id, parseInt(eventId));
        
        // Update ticket with QR code
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { qrCode }
        });

        // Create attendance record
        await prisma.attendance.create({
          data: {
            userId,
            eventId: parseInt(eventId),
            status: 'REGISTERED'
          }
        });

        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredPaymentId = expiredSession.metadata?.paymentId;
        
        if (expiredPaymentId) {
          await prisma.payment.update({
            where: { id: expiredPaymentId },
            data: { status: 'CANCELLED' }
          });
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
