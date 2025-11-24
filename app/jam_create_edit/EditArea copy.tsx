'use client';
import { useState } from 'react';
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

export default function EditArea() {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'informaciongeneral';

  // One state per section
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoType>({
    jam_title: '',
    location_title: '',
    location_adress: '',
    dates: {
      period: null,
      period_value: null,
      time: { from: '21:30', to: '00:30' },
      list_of_dates: [],
    },
  });
  const [photos, setPhotos] = useState<PhotosType>({ images: [] });
  const [features, setFeatures] = useState<FeaturesType>({
    styles: [],
    song_list: false,
    intruments_lend: false,
    drums: false,
  });
  const [description, setDescription] = useState<DescriptionType>({
    description: '',
  });
  const [social, setSocial] = useState<SocialType>({
    facebook: '',
    instagram: '',
    siteWeb: '',
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
        <GeneralInfo data={generalInfo} ondataChange={setGeneralInfo} />
      )}
      {currentSection === 'fotos' && (
        <UploadPhotos data={photos} ondataChange={setPhotos} />
      )}
      {currentSection === 'caracteristicas' && (
        <PlaceChars data={features} ondataChange={setFeatures} />
      )}
      {currentSection === 'descripcion' && (
        <PlaceDescription data={description} ondataChange={setDescription} />
      )}
      {currentSection === 'redessociales' && (
        <Social data={social} ondataChange={setSocial} />
      )}
    </div>
  );
}
