// Types for each section

import { RawDraftContentState } from 'draft-js';

export type GeneralInfoType = {
  jam_title: string;
  location_title: string;
  location_adress: string;
  coordinates: {
    lat: string | null;
    lng: string | null;
  };
  dates: {
    period: 'manual' | 'weekly' | undefined;
    day_of_week: string | undefined;
    time: { from: string; to: string | undefined };
    list_of_dates: Date[];
  };
};

export type PhotosType = {
  images: string[]; // or File[] if you store File objects
};

export type FeaturesType = {
  styles: string[];
  song_list: boolean;
  intruments_lend: boolean;
  drums: boolean;
};

export type DescriptionType = {
  description: RawDraftContentState | '';
};

export type SocialType = {
  facebook: string;
  instagram: string;
  siteWeb: string;
};

// Props for child components
export interface GeneralInfoProps {
  dataRef: React.RefObject<GeneralInfoType>;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface UploadPhotosProps {
  dataRef: React.RefObject<PhotosType>;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface PlaceCharsProps {
  dataRef: React.RefObject<FeaturesType>;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface PlaceDescriptionProps {
  dataRef: React.RefObject<DescriptionType>;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface SocialProps {
  dataRef: React.RefObject<SocialType>;
  childSaveOnUnmount: React.RefObject<() => void>;
}
