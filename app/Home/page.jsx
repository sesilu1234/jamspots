import { headers } from 'next/headers';
import { getHomeCards } from '@/lib/getHomeCards';
import HomeComponent from './HomeComponent'; // Import your UI component

export default async function HomePage() {
  const headerList = await headers();

  // 1. Get location from Vercel headers
  const userLocation = {
    city: headerList.get('x-vercel-ip-city') ?? 'Madrid (Local Dev)', 
    lat: headerList.get('x-vercel-ip-latitude') ?? '40.4168',
    lng: headerList.get('x-vercel-ip-longitude') ?? '-3.7038',
  };

  // 2. Prepare params (60km radius)
  const paramsCards = {
    dateOptions: 'week',
    lat: userLocation.lat,
    lng: userLocation.lng,
    distance: '60', // Just the number of KM
    styles: JSON.stringify([]),
    modality: JSON.stringify(['jam', 'open_mic']),
    order: 'popular'
  };

  // 3. Fetch data using the optimized RPC + LATERAL JOIN
  const homeCards = await getHomeCards(paramsCards);


  return <HomeComponent cards={homeCards || []} userLocation={userLocation} />;

   // For now, just a placeholder to verify it works
  // return (
  //   <main>
  //     <h1>Found {homeCards?.length || 0} Jams near you</h1>
  //     <pre>{JSON.stringify(homeCards, null, 2)}</pre>
  //   </main>
  // );
  
 
}