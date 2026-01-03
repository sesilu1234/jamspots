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
  slug: string;
}

type JamProps = {
  id: string;
  jam_title: string;
  jam_adress: string;
  jam_image_src: string;
  jam_slug: string;
  deleteJam: (id: string) => void;
};

export default function JamSessionList() {
  const [jams, setJams] = useState<Jam[]>([]);

  const [loading, setLoading] = useState(true);

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  function DeleteConfirmation() {
    const [text, setText] = useState('');

    const [showPanelDelete, setShowPanelDelete] = useState(true);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        {showPanelDelete && (
          <div className=" flex flex-col gap-2 bg-white p-4 rounded-md shadow-xl w-96">
            <p className="font-bold">
              Type <i className="font-semibold">delete</i> to confirm
            </p>

            <input
              className="border border-black  w-full py-1 px-3 mt-2 rounded-md"
              placeholder="delete"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={async () => {
                  setShowPanelDelete(false);
                  await deleteJam(idToDelete!);
                  setIdToDelete(null);
                }}
                disabled={text !== 'delete'}
                className={
                  text === 'delete'
                    ? 'bg-red-500 hover:bg-red-600 px-3 py-1  rounded-md'
                    : 'opacity-50 px-3 py-1 '
                }
              >
                Accept
              </button>

              <button
                onClick={() => setIdToDelete(null)}
                className="bg-gray-400 px-3 py-1 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  async function deleteJam(jamId: string) {
    // Llamada al API para eliminar
    await fetch(`/api/delete-session/${jamId}`, { method: 'DELETE' });

    // Actualizar estado eliminando el jam con ese id
    setJams((prev) => prev.filter((j) => j.id !== jamId));
  }

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
    <div className="flex flex-col mt-8 gap-6">
      {jams.map((jam, i) => (
        <Jam
          key={i}
          id={jam.id}
          jam_title={jam.jam_title}
          jam_adress={jam.location_address}
          jam_image_src={jam.image}
          jam_slug={jam.slug}
          deleteJam={setIdToDelete}
        />
      ))}

      <div className="mt-4 mx-auto container">
        <Link
          href={`/host/create`}
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

      {idToDelete ? <DeleteConfirmation /> : null}
    </div>
  );
}

function Jam({
  id,
  jam_title,
  jam_adress,
  jam_image_src,
  jam_slug,
  deleteJam,
}: JamProps) {
  return (
    <div className="flex items-center gap-8 py-4 mx-auto container">
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

      <div className="flex gap-4  w-[300px] ">
        <Link
          href={`/jam/${jam_slug}`}
          prefetch={false}
          className="px-3 py-1 rounded-sm  text-black  border border-black  hover:bg-[#d8a408]  transition-colors"
        >
          View
        </Link>

        <Link
          href={`/host/edit/${id}`}
          prefetch={false}
          className="px-3 py-1 rounded-sm ml-[20px] bg-black/80 text-white hover:bg-black"
        >
          Editar
        </Link>

        <button
          className="px-3 py-1 rounded-sm bg-red-600/80 text-white hover:bg-red-700"
          onClick={() => deleteJam(id)}
        >
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
