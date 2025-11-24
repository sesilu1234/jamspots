'use client';

import { useState } from 'react';
import Image from 'next/image';
import TrashButton from './icons/TrashButton';
import { UploadPhotosProps } from './types/types';

export default function PhotoUploader({
  data,
  ondataChange,
}: UploadPhotosProps) {
  const [photos, setPhotos] = useState<string[]>([]);

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
      <div className="flex justify-center m-12 ml-auto p-2 bg-black text-white w-32 rounded-lg">
        Save and Exit
      </div>

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
