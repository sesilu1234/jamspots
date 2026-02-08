// app/jam/[jamId]/page.tsx
import { getJam } from '@/lib/getJam';
import JamComponent from './JamComponent';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import { Jam } from '../types/jam';

type Props = {
  params: Promise<{ jamId: string }>;
}

// 1️⃣ Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jamId } = await params;
  const jam = await getJam(jamId);

  if (!jam) return { title: 'Jam Not Found' };

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

  const title = `${jam.jam_title} – ${jam.location_title}, ${rawCity}`;
  const description = `Check out the ${eventType} at ${jam.location_title} in ${rawCity}, ${country}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/jamspots_icon.png'],
    },
  };
}

// 2️⃣ Page Component with JSON-LD for SEO
export default async function JamPage({ params }: Props) {
  const { jamId } = await params;
  const jam = await getJam(jamId);


  console.log(`https://jamspots.xyz/jam/${jam!.slug}`);

  if (!jam) notFound();

  const addressParts = (jam.location_address || '').split(',').map((s: string) => s.trim());
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
  const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';

    const styleArray = Array.isArray(jam.styles) 
    ? jam.styles 
    : (jam.styles || '').split(',').map((s: string) => s.trim());
  const firstRealStyle = styleArray.find((s: string) => s.toLowerCase() !== 'all styles');
  const displayModality = jam.modality === 'open_mic' ? 'Open Mic' : 'Jam';
  const eventType = firstRealStyle ? `${firstRealStyle} ${displayModality}` : displayModality;

  const simpleDescription = `${eventType} at ${jam.location_title}, ${city}`;

  // Build JSON-LD dynamically
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": jam.jam_title,
    "startDate": jam.iso_date, // ISO string
    "location": {
      "@type": "Place",
      "name": jam.location_title,
      "address": jam.location_address
    },
      "description": simpleDescription,
    "image": jam.images!.slice(0, 1)[0] ?? undefined,
    "url": `https://jamspots.xyz/jam/${jam.slug}`
  };

  console.log(jsonLd);

  return (
    <>
      {/* JSON-LD Script for Google Rich Snippets */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

     <JamComponent jam={jam as unknown as Jam} />


    </>
  );
}
