'use client';
import { useState,useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import GeneralInfo from './edit_areas/GeneralInfo';
import UploadPhotos from './edit_areas/UploadPhotos';
import PlaceChars from './edit_areas/PlaceChars';
import Social from './edit_areas/Social';
import PlaceDescription from './edit_areas/PlaceDescription';
import {
  GeneralInfoType,
  PhotosType,
  FeaturesType,
  DescriptionType,
  SocialType,
} from './edit_areas/types/types';




type EditAreaProps = {
  childSaveOnUnmount: React.RefObject<() => void>;
};


export default function EditArea({ childSaveOnUnmount }: EditAreaProps) {



  
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'informaciongeneral';

  // One state per section
  const generalInfo = useRef<GeneralInfoType>({
    jam_title: '',
    location_title: '',
    location_adress: '',
    dates: {
      period: null,
      period_value: null,
      time: { from: '21:30', to: null },
      list_of_dates: [],
    },
  });
  const photos = useRef<PhotosType>({ images: [] });
  const features = useRef<FeaturesType>({
    styles: [],
    song_list: false,
    intruments_lend: false,
    drums: false,
  });
  const description = useRef<DescriptionType>({
    description: '',
  });
  const social = useRef<SocialType>({
    instagram: '',
    facebook: '',
    siteWeb: '',
    siteWebRefsssd:''
  });





  // Save all data (example)
  const handleSave = () => {
    const allData = {
      generalInfo,
      photos,
      features,
      social,
      description,
    };
    console.log('Saving all data:', allData);
    // send to backend...
  };



  return (
    <div>
      {currentSection === 'informaciongeneral' && (
        <GeneralInfo dataRef={generalInfo} childSaveOnUnmount={childSaveOnUnmount}/>
      )}
      {currentSection === 'fotos' && (
        <UploadPhotos dataRef={photos} childSaveOnUnmount={childSaveOnUnmount} />
      )}
      {currentSection === 'caracteristicas' && (
        <PlaceChars dataRef={features} childSaveOnUnmount={childSaveOnUnmount} />
      )}
      {currentSection === 'descripcion' && (
        <PlaceDescription dataRef={description} childSaveOnUnmount={childSaveOnUnmount} />
      )}
      {currentSection === 'redessociales' && (
        <Social dataRef={social} childSaveOnUnmount={childSaveOnUnmount} />
      )}
    </div>
  );
}
