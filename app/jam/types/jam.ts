export type Jam = {
  id: string;
  jam_title: string;
  location_title: string;
  location_address: string;
  periodicity: string;
  dayOfWeek: string | null;
  dates: string[];
  images: string[];
  modality: string;
  styles: string[];
  lista_canciones: boolean;
  instruments_lend: boolean;
  drums: boolean;
  description: {
    blocks: {
      key: string;
      data: Record<string, any>;
      text: string;
      type: string;
      depth: number;
      entityRanges: any[];
      inlineStyleRanges: any[];
    }[];
    entityMap: Record<string, any>;
  };
  social_links: {
    siteWeb: string;
    facebook: string;
    instagram: string;
  };
  location_coords: string;
  host_id: string;
  created_at: string;
  time_start: string;
  f_next_date: string;
  slug: string;
  lng: number;
  lat: number;
  display_date: string;
};



export interface JamCard {
  f_id: string;
  f_jam_title: string;
  f_location_title: string;
  f_styles: string[];
  f_location_address: string;
  f_next_date: string; // ISO String from Postgres
  f_jam_timezone: string;
  f_time_start: string;
  f_images: string[];
  f_slug: string;
  f_lat: number;
  f_lng: number;
  f_priority_score: number;
  f_distance_meters: number;
}

export interface UserLocation {
  city?: string;
  lat: string;
  lng: string;
}

