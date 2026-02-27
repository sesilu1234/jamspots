import Link from 'next/link';

export default function CitiesSection({ customCities = [] }) {



  const POPULAR_CITIES = [
  { name: 'Madrid', slug: 'madrid' },
  { name: 'London', slug: 'london' },
  { name: 'Chicago', slug: 'chicago' },
  { name: 'Austin', slug: 'austin' },
  { name: 'Melbourne', slug: 'melbourne' }
];

  const citiesToDisplay = customCities.length > 0 ? customCities : POPULAR_CITIES;

  

  return (
    <div className="w-full bg-foreground-1/5 py-10 ">
      <div className="max-w-[90%] w-[1300px] mx-auto px-6">
        <h3 className="text-sm font-bold tracking-[0.2em] text-tone-1/40 mb-6 uppercase text-center md:text-left">
          Popular Locations
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-x-8 gap-y-4">
          {citiesToDisplay.map((city) => (
            <Link
              key={city.name}
              href={`/${city.slug}`}
              className="text-sm font-medium hover:text-primary-1 transition-all border-b border-transparent hover:border-primary-1 pb-1 w-fit whitespace-nowrap"
            >
              Jams in {city.name}
            </Link>
          ))}
          
          <Link
            href="/cities"
            className="text-sm font-bold text-primary-1 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            Explore all cities →
          </Link>
        </div>
      </div>
    </div>
  );
}