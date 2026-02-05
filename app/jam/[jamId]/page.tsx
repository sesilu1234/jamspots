// app/jam/[jamId]/page.tsx
import { getJam } from '@/lib/getJam'
import JamComponent from './JamComponent'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'


type Props = {
  params: Promise<{ jamId: string }>
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jamId } = await params
  const jam = await getJam(jamId)

  if (!jam) return { title: 'Jam Not Found' }

  const styleArray = Array.isArray(jam.styles) 
    ? jam.styles 
    : (jam.styles || '').split(',').map((s: string) => s.trim());

  const firstRealStyle = styleArray.find((s: string) => s.toLowerCase() !== 'all styles');
  const displayModality = jam.modality === 'open_mic' ? 'Open Mic' : 'Jam';

  const eventType = firstRealStyle 
    ? `${firstRealStyle} ${displayModality}` 
    : displayModality;

  const addressParts = (jam.location_address || '').split(',').map((s: string) => s.trim());
  const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
  const rawCity = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';

  const title = `${jam.jam_title} – ${jam.location_title}, ${rawCity}`
  const description = `Check out the ${eventType} at ${jam.location_title} in ${rawCity}, ${country}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/jamspots_icon.png'],
    },
  }
}

export default async function JamPage({ params }: Props) {
  const { jamId } = await params;
  const jam = await getJam(jamId);

  if (!jam) {
    notFound();
  }

    const styleArray = Array.isArray(jam.styles) 
    ? jam.styles 
    : (jam.styles || '').split(',').map((s: string) => s.trim());

  const firstRealStyle = styleArray.find((s: string) => s.toLowerCase() !== 'all styles');
  const displayModality = jam.modality === 'open_mic' ? 'Open Mic' : 'Jam';

  const eventType = firstRealStyle 
    ? `${firstRealStyle} ${displayModality}` 
    : displayModality;

  const addressParts = (jam.location_address || '').split(',').map((s: string) => s.trim());
  const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
  const rawCity = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';

  const city = addressParts.at(-2) || '';

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": jam.jam_title,
    "description": `Check out the ${eventType} at ${jam.location_title} in ${rawCity}, ${country}.`,
    "startDate": jam.start_date, // MUST be ISO string
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": jam.location_title,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressCountry": country,
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "Jamspots",
      "url": "https://jampspots.xyz"
    }
  };

  return (
    <>
      <Script
        id="event-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema),
        }}
      />

      <JamComponent jam={jam} />
    </>
  );
}
