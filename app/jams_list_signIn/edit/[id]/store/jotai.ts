import { atom } from "jotai";
import {
  GeneralInfoType,
  PhotosType,
  FeaturesType,
  DescriptionType,
  SocialType,
} from '../edit_areas/types/types';

export interface FormType {
  generalInfo: GeneralInfoType;
  photos: PhotosType;
  features: FeaturesType;
  description: DescriptionType;
  social: SocialType;
}

export const formAtom = atom<FormType>({
  generalInfo: {
    jam_title: "",
    location_title: "",
    location_address: "",
    coordinates: { lat: "", lng: "" },
    dates: {
      period: "manual",
      day_of_week: null,
      time: { from: "21:30", to: null },
      list_of_dates: [],
    },
  },
  photos: { images: [] },
  features: { styles: [], song_list: false, intruments_lend: true, drums: true },
  description: { description: null },
  social: { instagram: "", facebook: "", siteWeb: "" },
});
