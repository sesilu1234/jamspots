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
  siteWebRefsssd: string;
};

// Props for child components
export interface GeneralInfoProps {
  dataRef: React.RefObject<GeneralInfoType>;
  childSaveOnUnmount: React.RefObject<() => void>;
 
}

export interface UploadPhotosProps {
  dataRef: React.RefObject<PhotosType>
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

