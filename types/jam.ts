


export interface JamCard {
  id: string;
  jam_title: string;
  location_title: string;
  styles: string[];
  location_address: string;
  next_date: string; // ISO String from Postgres
  jam_timezone: string;
  time_start: string;
  images: string[];
  slug: string;
  lat: number;
  lng: number;
  priority_score: number;
  distance_meters: number;
}

export interface UserLocation {
  city: string;
  latitude: number;
  longitude: number;
}

