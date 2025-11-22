'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GeneralInfo from './edit_areas/GeneralInfo';
import UploadPhotos from './edit_areas/UploadPhotos';
import PlaceChars from './edit_areas/PlaceChars';
import Social from './edit_areas/Social';

export default function EditArea() {
  return (
    // <GeneralInfo />;
    <Social />
  );
}
