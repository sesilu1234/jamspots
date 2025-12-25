'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import InfoIcon from './icons/InfoIcon';
import PhotosIcon from './icons/PhotosIcon';
import FeaturesIcon from './icons/FeaturesIcon';
import DescriptionIcon from './icons/DescriptionIcon';
import SocialIcon from './icons/SocialIcon';

import { useParams } from 'next/navigation';

const sections = [
  { id: 'informaciongeneral', label: 'Información general', Icon: InfoIcon },
  { id: 'fotos', label: 'Fotos', Icon: PhotosIcon },
  {
    id: 'caracteristicas',
    label: 'Caracteristicas del sitio',
    Icon: FeaturesIcon,
  },
  { id: 'descripcion', label: 'Descripcion', Icon: DescriptionIcon },
  { id: 'redessociales', label: 'Redes sociales', Icon: SocialIcon },
];

type EditAreaProps = {
  childSaveOnUnmount: React.RefObject<() => void>;
};

export default function EditSections({ childSaveOnUnmount }: EditAreaProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = searchParams.get('section') || 'informaciongeneral';

  const { id: slugId } = useParams();

  // local state for instant highlight
  const [currentSection, setCurrentSection] = useState(initialSection);

  const goToSection = (id: string) => {
    setCurrentSection(id); // instant highlight
    router.push(`/host/create?section=${id}`); // update URL
  };

  return (
    <div className="flex flex-col gap-8 mx-8  w-3/5">
      {sections.map(({ id, label, Icon }) => (
        <div
          key={id}
          onClick={() => {
            // call the current section save function
            goToSection(id);
            childSaveOnUnmount.current?.(); // then switch section
          }}
          className={`
            flex items-center p-2 gap-2 rounded-md cursor-pointer
           ${currentSection === id ? 'bg-gray-800/80  text-white' : 'bg-white hover:bg-gray-300'}
           
          `}
        >
          <Icon
            width={32}
            height={32}
            key={id}
            fill={`
           ${currentSection === id ? '#FFFFFF' : '#000000'}
           
          `}
          />

          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
