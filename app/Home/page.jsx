// app/jam/[jamId]/page.tsx
import { getJam } from '@/lib/getJam'
import JamComponent from './JamComponent'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ jamId: string }>
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata(): Promise<Metadata> {


  return {}
}

// 2. The Page Component
export default async function HomePage() {
  
  const headerList = await headers()


// Use the real header, but fallback to a mock value for local dev
const userLocation = {
  city: headerList.get('x-vercel-ip-city') ?? 'Madrid (Local Dev)',
  country: headerList.get('x-vercel-ip-country') ?? 'España',
  lat: headerList.get('x-vercel-ip-latitude') ?? '40.4168',
  lng: headerList.get('x-vercel-ip-longitude') ?? '-3.7038',
};


  console.log(userLocation);




  return <JamComponent jam={jam} />
}