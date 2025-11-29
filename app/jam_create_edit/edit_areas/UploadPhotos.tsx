'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import TrashButton from './icons/TrashButton';
import { UploadPhotosProps } from './types/types';

export default function PhotoUploader({
  dataRef,
  childSaveOnUnmount,
}: UploadPhotosProps) {
  const [photos, setPhotos] = useState<string[]>(dataRef.current.images);

  const photoStateRef = useRef(photos);
  photoStateRef.current = photos; // update every render

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    childSaveOnUnmount.current = () => {
      dataRef.current.images = photoStateRef.current;
    };

    return () => {
      childSaveOnUnmount.current = () => {};
    };
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, url]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="p-15 flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        {photos.map((url, index) => (
          <div
            key={index}
            className="relative w-40 h-40 rounded-xl overflow-hidden"
          >
            <Image src={url} alt="preview" fill className="object-cover" />

            <TrashButton onClick={() => removePhoto(index)} />
          </div>
        ))}

        {photos.length < 4 && (
          <label className="w-40 h-40 bg-gray-300 rounded-xl flex items-center justify-center cursor-pointer text-black">
            + Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
