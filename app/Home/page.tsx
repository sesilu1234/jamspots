import { headers } from 'next/headers';
import { getHomeCards } from '@/lib/getHomeCards';
import HomeComponent from './HomeComponent'; // Import your UI component


export default async function HomePage() {
  const headerList = await headers();

  // 1. Get location from Vercel headers
const userLocation = {
  city: headerList.get('x-vercel-ip-city') ?? 'Madrid (Local Dev)',
  latitude: Number(headerList.get('x-vercel-ip-latitude')) || 40.4168,
  longitude: Number(headerList.get('x-vercel-ip-longitude')) || -3.7038,
};

  // 2. Prepare params (60km radius)
  const paramsCards = {
    dateOptions: 'week',
    lat: userLocation.latitude,
    lng: userLocation.longitude,
    distance: '60', // Just the number of KM
    styles: JSON.stringify([]),
    modality: JSON.stringify(['jam', 'open_mic']),
    order: 'popular'
  };

  // 3. Fetch data using the optimized RPC + LATERAL JOIN
const homeCards = []


  // 1. Construimos el JSON-LD tipo ItemList con Events genéricos
  // const jsonLd = {
  //   "@context": "https://schema.org",
  //   "@type": "ItemList",
  //   "itemListElement": homeCards?.map((jam: any, index: number) => ({
  //     "@type": "ListItem",
  //     "position": index + 1,
  //     "item": {
  //       "@type": "Event",
  //       "name": jam.jam_title,
  //       "startDate": jam.next_date_local, // Formato esperado: ISO 8601 (ej. 2026-02-15T20:00:00)
  //       "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  //       "eventStatus": "https://schema.org/EventScheduled",
  //       "location": {
  //         "@type": "Place",
  //         "name": jam.location_title,
  //         "address": jam.location_address, // String plano es aceptado por Google
  //       },
  //       "url": `https://jamspots.xyz/jam/${jam.slug}`,
  //     },
  //   })) || [],
  // };


 return (
    <>
      {/* 2. Inyección directa del script (Sin <Head>) */}
      {/* {homeCards?.length! > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )} */}

      {/* 3. Tu UI */}
      <HomeComponent cards={ []} userLocation={userLocation} />
    </>
  );
 
}