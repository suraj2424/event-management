import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { getStripeJs } from '@/lib/stripe';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface PurchaseButtonProps {
  eventId: number;
  price: number;
  currency: string;
  eventTitle: string;
  disabled?: boolean;
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  eventId,
  price,
  currency,
  eventTitle,
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePurchase = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripeJs();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error('Stripe redirect error:', error);
        }
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert(error?.message || 'Failed to process purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (price === 0) {
    return (
      <Button 
        onClick={() => router.push(`/events/${eventId}/register`)}
        className="w-full"
        disabled={disabled}
      >
        Register for Free
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePurchase} 
      disabled={loading || disabled}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Buy Ticket - {currency} {price}
        </>
      )}
    </Button>
  );
};

export default PurchaseButton;
