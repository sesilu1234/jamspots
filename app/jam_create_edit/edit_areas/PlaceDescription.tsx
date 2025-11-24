import { ChangeEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { PlaceDescriptionProps } from './types/types';

import dynamic from 'next/dynamic';

const DraftEditor = dynamic(() => import('./textSlate'), {
  ssr: false,
});

export default function PlaceDescription({
  dataRef, childSaveOnUnmount
}: PlaceDescriptionProps) {
  const [text, setText] = useState('');

  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex justify-center m-3 ml-auto p-2 bg-black text-white w-32 rounded-lg cursor-pointer">
        Save and Exit
      </div>
      <Toaster />
      <div className="ml-48 mt-12">
        <DraftEditor />
      </div>
    </div>
  );
}
