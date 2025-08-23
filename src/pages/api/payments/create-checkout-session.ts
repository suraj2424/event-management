import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe-server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, {});
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.price || event.price <= 0) {
      return res.status(400).json({ error: 'This is a free event' });
    }

    // Check if user already has a ticket for this event
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        userId: user.id,
        eventId: event.id,
        status: { in: ['ACTIVE', 'USED'] }
      },
      select: {
        id: true,
        status: true,
        paymentId: true,
      }
    });

    if (existingTicket) {
      // If the user has an ACTIVE/USED ticket tied to a payment or already USED, block purchase
      if (existingTicket.status === 'USED' || existingTicket.paymentId) {
        return res.status(400).json({ error: 'You already have a ticket for this event' });
      }
      // Otherwise, this is likely a legacy free ticket (no payment). Cancel it to allow purchase
      await prisma.ticket.update({
        where: { id: existingTicket.id },
        data: { status: 'CANCELLED' }
      });
      // Also cancel attendance if present
      await prisma.attendance.updateMany({
        where: { userId: user.id, eventId: event.id, status: { in: ['REGISTERED', 'CONFIRMED'] } },
        data: { status: 'CANCELLED' }
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: event.price,
        currency: event.currency,
        userId: user.id,
        eventId: event.id,
        stripeSessionId: '', // Will be updated after Stripe session creation
      }
    });

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: event.currency.toLowerCase(),
            product_data: {
              name: `Ticket for ${event.title}`,
              description: `Event on ${new Date(event.startDate).toLocaleDateString()}`,
            },
            unit_amount: Math.round(event.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/events/${event.id}`,
      metadata: {
        eventId: event.id.toString(),
        userId: user.id,
        paymentId: payment.id,
      },
    });

    // Update payment with Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: stripeSession.id }
    });

    res.status(200).json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
