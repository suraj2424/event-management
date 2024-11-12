import { EventForm } from '@/components/parts/EventForm';
import { useRouter } from 'next/router';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/events');
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <EventForm/>
    </div>
  );
}