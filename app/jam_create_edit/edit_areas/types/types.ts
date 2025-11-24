// Types for each section
export type GeneralInfoType = {
  jam_title: string;
  location_title: string;
  location_adress: string;
  dates: {
    period: string | null;
    period_value: string | null;
    time: { from: string; to: string };
    list_of_dates: string[];
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
  description: string;
};

export type SocialType = {
  facebook: string;
  instagram: string;
  siteWeb: string;
};

// Props for child components
export interface GeneralInfoProps {
  data: GeneralInfoType;
  ondataChange: (data: GeneralInfoType) => void;
}

export interface UploadPhotosProps {
  data: PhotosType;
  ondataChange: (data: PhotosType) => void;
}

export interface PlaceCharsProps {
  data: FeaturesType;
  ondataChange: (data: FeaturesType) => void;
}

export interface PlaceDescriptionProps {
  data: DescriptionType;
  ondataChange: (data: DescriptionType) => void;
}

export interface SocialProps {
  data: SocialType;
  ondataChange: (data: SocialType) => void;
}
