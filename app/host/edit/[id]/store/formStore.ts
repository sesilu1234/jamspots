import { create } from 'zustand';
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

interface FormStore {
  form: FormType;
  setForm: (
    updater: Partial<FormType> | ((prev: FormType) => FormType),
  ) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  form: {
    generalInfo: {
      jam_title: '',
      location_title: '',
      location_address: '',
      coordinates: { lat: '', lng: '' },
      dates: {
        period: 'manual',
        day_of_week: null,
        time: { from: '21:30', to: null },
        list_of_dates: [],
      },
    },
    photos: { images: [] },
    features: {
      modality: 'jam',
      styles: [],
      song_list: false,
      intruments_lend: true,
      drums: true,
    },
    description: { description: null },
    social: { instagram: '', facebook: '', siteWeb: '' },
  },
  setForm: (updater) =>
    set((state) => ({
      form:
        typeof updater === 'function'
          ? updater(state.form)
          : { ...state.form, ...updater },
    })),
}));
