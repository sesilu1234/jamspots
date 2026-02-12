'use client';
import { useState, useRef, useEffect } from 'react';

import Sections from './sections';
import { useRouter } from 'next/navigation';

import { validateJam } from './clientCheck';
import { convertFromRaw } from 'draft-js';

import { Jam } from './typeCheck';

import { useParams } from 'next/navigation';

import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { useAtom } from 'jotai';
import { formAtom } from './store/jotai';

import { useFormStore } from './store/formStore'; // path a tu store

type EditAreaProps = {
  childSaveOnUnmount: React.RefObject<() => void>;
};

export default function EditArea({ childSaveOnUnmount }: EditAreaProps) {
  const setForm = useFormStore((state) => state.setForm);

  const router = useRouter(); // ✅ call hook here, at top level

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setForm({
      generalInfo: {
        jam_title: '',
        location_title: '',
        location_address: '',
        coordinates: {
          lat: '',
          lng: '',
        },
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
      social: {
        instagram: '',
        facebook: '',
        siteWeb: '',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setLoading(false);
  }, []);
  // ✅ solo se ejecuta cuando cambia id

  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-

  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-
  //#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-

  const handleSave = async () => {
    childSaveOnUnmount.current();

    const form = useFormStore.getState().form;

    const images_files: File[] = [];
    for (const url of form.photos.images) {
      const res = await fetch(url);
      const blob = await res.blob();
      // optional: give a filename
      images_files.push(
        new File([blob], `image-${Date.now()}.png`, { type: blob.type }),
      );
    }

    let raw_desc = '';
    try {
      raw_desc = convertFromRaw(form.description.description!)
        .getPlainText()
        .trim();
    } catch {}

    const jamData = {
      jam_title: form.generalInfo.jam_title,
      location_title: form.generalInfo.location_title,
      location_address: form.generalInfo.location_address,
      periodicity: form.generalInfo.dates.period,
      dayOfWeek: form.generalInfo.dates.day_of_week,
      dates: form.generalInfo.dates.list_of_dates,
      time_start: form.generalInfo.dates.time.from,
      images_three: images_files.length == 3 ? true : false,
      modality: form.features.modality,
      styles: form.features.styles,
      lista_canciones: form.features.song_list,
      raw_desc: raw_desc,

      instruments_lend: form.features.intruments_lend,
      drums: form.features.drums,
      description: form.description.description,
      social_links: form.social,
      location_coords: form.generalInfo.coordinates,
    };

    const parsed_jamData = validateJam(jamData as unknown as Partial<Jam>);

    if (!parsed_jamData.success) {
      // Get the first error message from the errors object
      let firstMsg = 'Unknown error';

      const errorsObj = parsed_jamData.errors;
      if (errorsObj && Object.keys(errorsObj).length > 0) {
        const firstKey = Object.keys(errorsObj)[0];
        firstMsg = errorsObj[firstKey];
      }

      return { success: false, message: firstMsg };
    }

    const payload = new FormData();
    payload.append('jamColumns', JSON.stringify(jamData));
    images_files.forEach((file) => payload.append('images', file));

    const res = await fetch('/api/private/create-session', {
      method: 'POST',
      body: payload, // ⬅️ solo FormData
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.error };
    }
    return { success: true };
  };

  const [progress, setProgress] = useState<number>(0);

  const [saving, setSaving] = useState(false);

  if (loading) return null;
  return (
    <div className="">
      {saving ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-[501]">
          <ProgressDemo progress={progress} setProgress={setProgress} />
        </div>
      ) : null}
      <div
        className="flex justify-center m-12 ml-auto p-2 bg-black text-white w-32 h-10 rounded-lg cursor-pointer 
      hover:text-black hover:bg-slate-200 hover:border hover:border-black"
        onClick={async () => {
          setProgress(13);
          setSaving(true);

          const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

          // run progress animation in parallel with save
          const savePromise = handleSave(); // run but capture result
          await Promise.all([
            (async () => {
              await wait(500);
              setProgress(33);
              await wait(1000);
              setProgress(66);
            })(),
            savePromise,
          ]);

          const saveResult = await savePromise; // handleSave should return { success: true/false }

          if (!saveResult?.success) {
            setSaving(false);
            toast(saveResult.message, {
              description: '',
              action: {
                label: 'Understood',
                onClick: () => console.log('Understood'),
              },
            });
            return; // only navigate if success
          }

          await wait(200);
          setProgress(100);
          await wait(200);

          setSaving(false);

          router.push('/host'); // only navigate if success
        }}
      >
        {saving ? 'Saving…' : 'Save and Exit'}
        <Toaster />
      </div>

      <Sections childSaveOnUnmount={childSaveOnUnmount} />
    </div>
  );
}

import { Progress } from '@/components/ui/progress';

type ProgressDemoProps = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

export function ProgressDemo({ progress, setProgress }: ProgressDemoProps) {
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-64" />;
}
