'use client';
import { useState, useRef, useEffect } from 'react';
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
    coordinates: {
      lat: '',
      lng: '',
    },
    dates: {
      period: undefined,
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
    siteWebRefsssd: '',
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

 
  


// const a = {
	
// jam_title:generalInfo.current.jam_title

	
// location_title:generalInfo.current.location_title,

// location_adress:generalInfo.current.location_adress,

		
// periodicity:generalInfo.current.dates.period,

		
// dates:generalInfo.current.dates.list_of_dates,

		
// images:photos.current,

	
// styles:features.current.styles,

	
// lista_canciones:features.current.song_list,

		
// instruments_lend:features.current.intruments_lend,

		
// drums:features.current.intruments_lend,

		
// description:description.current.description,

		
// social_links: social.current,

		
// host_id:,

		
// created_at:,

	
// location_coords:,


// }



  const handleCreate = async () => {
    const res = await fetch('/api/create-session', {
      method: 'POST',
      body: JSON.stringify({ title: 'Blues Jam' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <div
        className="flex justify-center m-12 ml-auto p-2 bg-black text-white w-32 h-10 rounded-lg cursor-pointer 
  hover:text-black hover:bg-slate-200 hover:border hover:border-black"
        onClick={() => handleCreate()}
      >
        Save and Exit
      </div>

      {currentSection === 'informaciongeneral' && (
        <GeneralInfo
          dataRef={generalInfo}
          childSaveOnUnmount={childSaveOnUnmount}
        />
      )}
      {currentSection === 'fotos' && (
        <UploadPhotos
          dataRef={photos}
          childSaveOnUnmount={childSaveOnUnmount}
        />
      )}
      {currentSection === 'caracteristicas' && (
        <PlaceChars
          dataRef={features}
          childSaveOnUnmount={childSaveOnUnmount}
        />
      )}
      {currentSection === 'descripcion' && (
        <PlaceDescription
          dataRef={description}
          childSaveOnUnmount={childSaveOnUnmount}
        />
      )}
      {currentSection === 'redessociales' && (
        <Social dataRef={social} childSaveOnUnmount={childSaveOnUnmount} />
      )}
    </div>
  );
}
