import { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { PlaceDescriptionProps } from './types/types';

import dynamic from 'next/dynamic';

const DraftEditor = dynamic(() => import('./textSlate'), {
  ssr: false,
});

export default function PlaceDescription({
  dataRef,
  childSaveOnUnmount,
}: PlaceDescriptionProps) {
  const [text, setText] = useState('');

  return (
    <div className="p-6 flex flex-col gap-3">
      <Toaster />
      <div className="ml-48 mt-12">
        <DraftEditor
          dataRef={dataRef}
          childSaveOnUnmount={childSaveOnUnmount}
        />
      </div>
    </div>
  );
}
