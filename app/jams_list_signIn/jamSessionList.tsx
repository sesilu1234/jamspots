'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface Jam {
  id: string;
  jam_title: string;
  location_address: string;
  image: string;
}

type JamProps = {
  id: string;
  jam_title: string;
  jam_adress: string;
  jam_image_src: string;
};

export default function JamSessionList() {
  const [jams, setJams] = useState<Jam[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJams = async () => {
      try {
        const res = await fetch('/api/get-user-jams');
        if (!res.ok) throw new Error('Failed to fetch jams');
        const data: Jam[] = await res.json();

        setJams(data);
      } catch {
        console.log('Error while fetching');
      } finally {
        setLoading(false);
      }
    };
    fetchJams();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col mt-24 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );

  return (
    <div className="flex flex-col mt-24 gap-6">
      {jams.map((jam, i) => (
        <Jam
          key={i}
          id={jam.id}
          jam_title={jam.jam_title}
          jam_adress={jam.location_address}
          jam_image_src={jam.image}
        />
      ))}

      <div className="mt-4 mx-auto w-[1070px]">
        <Link
          href={`/jams_list_signIn/create`}
          prefetch={false}
          className="flex justify-center items-center h-32 bg-gray-500 rounded-lg w-[300px]"
        >
          <div className="flex items-center justify-between font-semibold text-white gap-2">
            <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="white"
              >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
            </div>
            <span>Add a new jam</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Jam({ id, jam_title, jam_adress, jam_image_src }: JamProps) {
  return (
    <div className="flex items-center gap-8 py-4 mx-auto w-[1070px]">
      <div className=" w-[300px] h-32 relative">
        <Image
          src={jam_image_src}
          alt={jam_title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col  w-[420px] px-[20px]">
        <h3 className="text-lg font-bold line-clamp-2">{jam_title}</h3>

        <h1 className="text-sm text-gray-600 font-semibold line-clamp-2">
          {jam_adress}
        </h1>
      </div>

      <div className="flex gap-4  w-[200px] ">
        <Link
          href={`/jams_list_signIn/edit/${id}`}
          prefetch={false}
          className="px-3 py-1 rounded-sm bg-black/80 text-white hover:bg-black"
        >
          Editar
        </Link>

        <button className="px-3 py-1 rounded-sm bg-red-600/80 text-white hover:bg-red-700">
          Eliminar
        </button>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex items-center gap-8 py-4 mx-auto w-[1070px]">
      <Skeleton className="w-[300px] h-32 rounded-xl" />
      <div className="space-y-2 w-[420px] ">
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <Skeleton className="h-4" />
      </div>
    </div>
  );
}
