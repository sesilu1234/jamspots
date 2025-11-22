'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GeneralInfo from './edit_areas/GeneralInfo';

export default function EditArea() {
  return <GeneralInfo />;
}
