// app/jam/[jamId]/page.tsx
// import { getJam } from '@/lib/getJam'
// import HomeComponent from './HomeComponent'
// import { Metadata } from 'next'
// import { notFound } from 'next/navigation'

// type Props = {
//   params: Promise<{ jamId: string }>
// }

// 1. Dynamic SEO Metadata Generation
// export async function generateMetadata(): Promise<Metadata> {


//   return {}
// }

// 2. The Page Component
export default async function HomePage() {
  
//   const headerList = await headers()


// // Use the real header, but fallback to a mock value for local dev
// const userLocation = {
//   city: headerList.get('x-vercel-ip-city') ?? 'Madrid (Local Dev)',
//   country: headerList.get('x-vercel-ip-country') ?? 'España',
//   lat: headerList.get('x-vercel-ip-latitude') ?? '40.4168',
//   lng: headerList.get('x-vercel-ip-longitude') ?? '-3.7038',
// };

// const dateOptions = searchParams.get('dateOptions')!;
//     const order = searchParams.get('order')!; // 'closeness' o 'popular'
//     const lat = parseFloat(searchParams.get('lat')!);
//     const lng = parseFloat(searchParams.get('lng')!);
//     const distance = parseFloat(searchParams.get('distance')!) * 1000 || 60000;
//     const stylesParam = searchParams.get('styles');
//     const modalityParam = searchParams.get('modality');



//     const paramsCards = new URLSearchParams({
        
//           dateOptions: dateOptionsRef.current,
//           order: String(orderRef.current),
//           lat: String(locationSearch?.coordinates.lat),
//           lng: String(locationSearch?.coordinates.lng),
//           distance: String(distanceRef.current),
//           styles: JSON.stringify(stylesRef.current),
//           modality: JSON.stringify(modalityRef.current),
//         });

//         const cardsFetch = await fetch(
//           `/api/public/get-jams-cards-filtered?${paramsCards}`,
//         );




//   console.log(userLocation);




  // return <HomeComponent cards={cards} />

  return null
}