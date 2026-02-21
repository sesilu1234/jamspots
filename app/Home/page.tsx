


import { headers, cookies } from 'next/headers';
import { getHomeCards } from '@/lib/getHomeCards';
import HomeComponent from './HomeComponent'; // Import your UI component
import { JamCard } from '@/types/jam';

const FOUR_HOURS = 4 * 60 * 60 * 1000;


export default async function HomePage() {
// Ensure this is inside an async function (like an RSC or Server Action)
const headerList = await headers(); 
const cookieStore = await cookies();


const locationCookie = cookieStore.get('user_location');

let userLocation;

if (locationCookie) {
  try {
    const decodedValue = decodeURIComponent(locationCookie.value);
    const parsed = JSON.parse(decodedValue);
    
    if (Date.now() - parsed.timestamp < FOUR_HOURS) {
      userLocation = {
        city: parsed.city,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      };
    }
  } catch (e) {
    console.error("Failed to parse location cookie", e);
  }
}

// 2️⃣ If no valid cookie → use Vercel headers
if (!userLocation) {
  const cityHeader = headerList.get('x-vercel-ip-city');
  const latHeader = headerList.get('x-vercel-ip-latitude');
  const lonHeader = headerList.get('x-vercel-ip-longitude');

  userLocation =
    cityHeader && latHeader && lonHeader
      ? {
          city: decodeURIComponent(cityHeader),
          latitude: Number(latHeader),
          longitude: Number(lonHeader),
        }
      : {
          city: 'Madrid, Spain',
          latitude: 40.4168,
          longitude: -3.7038,
        };
}



  // 2. Prepare params (60km radius)
  const paramsCards = {
    dateOptions: 'week',
    lat: userLocation.latitude,
    lng: userLocation.longitude,
    distance: '60', // Just the number of KM
    styles: JSON.stringify([]),
    modality: JSON.stringify(['jam', 'open_mic']),
    order: 'soonest',
  };

  // 3. Fetch data using the optimized RPC + LATERAL JOIN
  const homeCards = await getHomeCards(paramsCards);
  

  const validJams =
    homeCards?.slice(0, 20).filter((jam) => jam.slug && jam.jam_title) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Upcoming Jam Sessions',
    description: 'Discover the best open mics and jam sessions worldwide.',
    itemListElement: validJams.map((jam, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://jamspots.xyz/jam/${jam.slug}`, // URL en el nivel de lista
      item: {
        '@type': 'Event',
        name: jam.jam_title,
        startDate: jam.next_date_local, // iso_date es mejor por el offset (+01:00)
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: jam.location_title || 'Venue',
          address: {
            '@type': 'PostalAddress',
            streetAddress: jam.location_address || '',
          },
        },
        image: jam.images?.[0] || 'https://jamspots.xyz/jamspots_icon.png',
        description: `Join the ${jam.jam_title} at ${jam.location_title}. Open stage for musicians.`,
      },
    })),
  };


  return (
    <>
      {homeCards!.length! > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* 3. Tu UI */}
      <HomeComponent
        cards={(homeCards || []) as JamCard[]}
        userLocation={userLocation}
      />
    </>
  );
}
