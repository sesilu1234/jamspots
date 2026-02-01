// Types for each section

import { RawDraftContentState } from 'draft-js';

export type GeneralInfoType = {
  jam_title: string;
  location_title: string;
  location_address: string;
  coordinates: {
    lat: string;
    lng: string;
  };
  dates: {
    period: string;
    day_of_week: string | null;
    time: { from: string; to: string | null };
    list_of_dates: string[];
  };
};

export type PhotosType = {
  images: string[]; // or File[] if you store File objects
};

export type ModalityType = 'jam' | 'open_mic';

export type FeaturesType = {
  modality: ModalityType;
  styles: string[];
  song_list: boolean;
  intruments_lend: boolean;
  drums: boolean;
};

export type DescriptionType = {
  description: RawDraftContentState | null;
};

export type SocialType = {
  facebook: string;
  instagram: string;
  siteWeb: string;
};

// Props for child components
export interface GeneralInfoProps {
  data: GeneralInfoType;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface UploadPhotosProps {
  data: PhotosType;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface PlaceCharsProps {
  data: FeaturesType;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface PlaceDescriptionProps {
  data: DescriptionType;
  childSaveOnUnmount: React.RefObject<() => void>;
}

export interface SocialProps {
  data: SocialType;
  childSaveOnUnmount: React.RefObject<() => void>;
}
