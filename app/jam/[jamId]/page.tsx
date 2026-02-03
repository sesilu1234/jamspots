// app/jam/[jamId]/page.tsx
import { getJam } from '@/lib/getJam'
import JamComponent from './JamComponent'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

// 2. The Page Component
export default async function JamPage({ params }: Props) {
  const { jamId } = await params;
  
  const jam = await getJam(jamId);

  // If Supabase returns null, trigger the Next.js 404 page
  if (!jam) {
    notFound();
  }

  return <JamComponent jam={jam} />
}