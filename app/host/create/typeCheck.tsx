export type Jam = {
  id: string;
  jam_title: string;
  location_title: string;
  location_address: string;
  periodicity: string;
  dayOfWeek:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  dates: string[];
  images: string[];
  modality: string;
  styles: string[];
  images_three: boolean;
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
  location_coords: {
    lat: number;
    lng: number;
  };
  host_id: string;
  created_at: string;
  time_start: string;
  f_next_date: string;
  slug: string;
  lng: number;
  lat: number;
  display_date: string;
};
