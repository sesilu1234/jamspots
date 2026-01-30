'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface Jam {
  id: string;
  jam_title: string;
  location_address: string;
  image: string;
  slug: string;
  validated: boolean;
}

type JamProps = {
  id: string;
  jam_title: string;
  jam_adress: string;
  jam_image_src: string;
  jam_slug: string;
  is_validated: boolean;
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
            <p className="font-seminbold">
              Type <i className="font-medium">delete</i> to confirm
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
                    ? 'bg-red-400 hover:bg-rose-500 px-3 py-1  rounded-md'
                    : 'opacity-50 px-3 py-1 '
                }
              >
                Accept
              </button>

              <button
                onClick={() => setIdToDelete(null)}
                className="bg-gray-400/40 px-3 py-1 rounded-md hover:bg-gray-400/70"
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
    await fetch(`/api/private/delete-session/${jamId}`, { method: 'DELETE' });

    // Actualizar estado eliminando el jam con ese id
    setJams((prev) => prev.filter((j) => j.id !== jamId));
  }

  useEffect(() => {
    const fetchJams = async () => {
      try {
        const res = await fetch('/api/private/get-user-jams');
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
      <div className="flex flex-col mt-8 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );

  return (
    <div className=" flex flex-col mt-8 gap-6">
      {jams.map((jam, i) => (
        <Jam
          key={i}
          id={jam.id}
          jam_title={jam.jam_title}
          jam_adress={jam.location_address}
          jam_image_src={jam.image}
          jam_slug={jam.slug}
          is_validated={jam.validated}
          deleteJam={setIdToDelete}
        />
      ))}

      <div className="mt-6 mx-auto container flex justify-center">
        <Link
          href="/host/create"
          prefetch={false}
          className="
      group relative flex items-center justify-center
      h-24 md:h-24 w-3/10 min-w-[200px] max-w-[320px]
      rounded-2xl
      border border-zinc-300 bg-white/50 backdrop-blur-md
      transition-all duration-500 ease-out
      hover:border-zinc-700 hover:bg-white/80
      hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
      hover:-translate-y-1
      active:scale-[0.98]
    "
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.03] pointer-events-none" />

          <div className="flex items-center gap-4">
            <div
              className="
          relative flex h-10 w-10 items-center justify-center 
          rounded-xl bg-zinc-900/00 border-2  text-black
          transition-all duration-500 ease-spring
          group-hover:bg-yellow-400 group-hover:text-black group-hover:rotate-90
        "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="w-6 h-6 fill-current"
              >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-sm md:text-base font-semibold tracking-tight text-zinc-900">
                Add new jam
              </span>
              <span className="text-xs text-zinc-500 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Start a session
              </span>
            </div>
          </div>
        </Link>
      </div>

      {idToDelete ? <DeleteConfirmation /> : null}
    </div>
  );
}

import { Pencil, Eye, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ButtonGroup } from '@/components/ui/button-group';


function Jam({
  id,
  jam_title,
  jam_adress,
  jam_image_src,
  jam_slug,
  is_validated, // Destructure it here
  deleteJam,
}: JamProps) {
  return (
    <div className={`flex items-center gap-8 py-4 mx-auto container transition-opacity ${!is_validated ? 'opacity-75' : 'opacity-100'}`}>
      
      {/* IMAGE CONTAINER */}
      <div className="w-3/10 h-32 relative">
        <Image
          src={jam_image_src}
          alt={jam_title}
          fill
          sizes="(max-width: 1280px) 30vw, 400px"
          className="object-cover rounded-lg"
        />
        
        {/* VALIDATION BADGE */}
        {!is_validated && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] uppercase font-bold max-w-3/4 px-2 py-1 rounded shadow-md flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Pending Review
          </div>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col w-4/10 px-[20px]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold line-clamp-2">{jam_title}</h3>
          {!is_validated && (
            <span className="text-amber-600 text-xs font-medium hidden sm:inline">
              (In validation)
            </span>
          )}
        </div>

        <h1 className="text-sm text-gray-600 font-semibold line-clamp-2">
          {jam_adress}
        </h1>
      </div>

      {/* ACTIONS */}
      <div className="hidden md:flex flex-col md:flex-row items-start gap-4 w-3/10 text-sm md:text-lg">
        {/* Only show View if validated, or keep it but maybe disable it? */}
        <Link
          href={`/jam/${jam_slug}`}
          prefetch={false}
          className={`px-3 py-1 rounded-sm border-1 border-black transition-colors ${
            !is_validated 
              ? 'bg-zinc-500 opacity-80 hover:bg-zinc-600' 
              : 'bg-zinc-700 text-zinc-100 hover:bg-zinc-800'
          }`}
         
        >
          View
        </Link>

        <Link
          href={`/host/edit/${id}`}
          prefetch={false}
          className="px-3 py-1 rounded-sm md:ml-[20px] bg-zinc-200 text-zinc-900 hover:bg-zinc-300 border-1 border-black"
        >
          Edit
        </Link>

        <button
          className="px-3 py-1 rounded-sm bg-red-500/90 text-white hover:bg-red-700"
          onClick={() => deleteJam(id)}
        >
          Delete
        </button>
      </div>
      
      <MobileMenu jam_slug={jam_slug} id={id} deleteJam={deleteJam} />
    </div>
  );
}
export function SkeletonCard() {
  return (
    <div className="flex items-center gap-8 py-4 mx-auto container">
      <Skeleton className=" w-3/10 h-32 rounded-xl" />
      <div className="space-y-2 w-4/10">
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <Skeleton className="h-4" />
      </div>
    </div>
  );
}

type MobileMenuProps = Pick<JamProps, 'jam_slug' | 'id' | 'deleteJam'>;

export function MobileMenu({ jam_slug, id, deleteJam }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="md:hidden relative" ref={menuRef}>
      <button
        aria-label="More Options"
        className="bg-slate-800/30 hover:bg-slate-800/50 px-1 rounded-lg text-black hover:border-0 border-white flex items-center justify-center"
        onClick={() => setOpen((o) => !o)}
      >
        <MoreHorizontalIcon />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 py-1 px-1 border-1 border-black/10 bg-slate-50/80 text-black text-sm backdrop-blur-sm rounded-md shadow-lg z-50">
          <div className="flex flex-col">
            <Link href={`/jam/${jam_slug}`} prefetch={false}>
              <div className="flex items-center gap-2 px-1 py-2 hover:bg-black/10 rounded-md">
                <Eye className="text-black" /> View
              </div>
            </Link>

            <Link href={`/host/edit/${id}`} prefetch={false}>
              <div className="flex items-center gap-2 px-1 py-2 hover:bg-black/10 rounded-md">
                <Pencil className="text-amber-600" /> Edit
              </div>
            </Link>

            <button
              onClick={() => {
                deleteJam(id);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-1 py-2 hover:bg-black/10  rounded-md w-full text-left"
            >
              <Trash2Icon className="text-red-500" /> Trash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
