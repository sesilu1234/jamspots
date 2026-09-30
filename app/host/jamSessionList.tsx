'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
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

    /**
     * Named, not just counted. Typing "delete" only guards against a stray
     * click; it does nothing about deleting the wrong jam, which is the
     * mistake that actually costs something here.
     */
    const jam = jams.find((j) => j.id === idToDelete);

    return (
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
        {showPanelDelete && (
          <div className="flex w-96 max-w-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <p className="text-[15px] font-bold tracking-tight text-zinc-900">
              Delete this jam?
            </p>

            {jam ? (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3">
                <p className="truncate text-sm font-bold tracking-tight text-zinc-900">
                  {jam.jam_title}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-zinc-500">
                  {jam.location_address}
                </p>
              </div>
            ) : null}

            <p className="mt-4 text-[13px] text-zinc-600">
              This cannot be undone. Type{' '}
              <i className="font-semibold">delete</i> to confirm.
            </p>

            <input
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-500 focus:ring-4 focus:ring-zinc-900/5"
              placeholder="delete"
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Cancel first, so the destructive button is not the one under the
                cursor when the dialog opens. */}
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setIdToDelete(null)}
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-[#1B1F2A] bg-white px-4 text-sm font-bold tracking-tight text-[#1B1F2A] shadow-[3px_3px_0_0_#1B1F2A] transition-[transform,box-shadow] duration-150 hover:shadow-[4px_4px_0_0_#1B1F2A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#1B1F2A]"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowPanelDelete(false);
                  await deleteJam(idToDelete!);
                  setIdToDelete(null);
                }}
                disabled={text.toLowerCase() !== 'delete'}
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-red-800 bg-red-600 px-4 text-sm font-bold tracking-tight text-white shadow-[3px_3px_0_0_#7f1d1d] transition-[transform,box-shadow,background-color] duration-150 hover:bg-red-700 hover:shadow-[4px_4px_0_0_#7f1d1d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#7f1d1d] disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
              >
                Delete jam
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

  /**
   * One jam is the common case, and for that host a count reading "1 jam" and
   * a second way to reach the same page are both noise. Both appear only once
   * there is a list worth navigating.
   */
  const hasSeveral = jams.length > 1;

  const header = (
    <div className="ml-3 mt-8">
      <div className="mt-6 ml-6 md:ml-24">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <h3 className="text-5xl font-extrabold tracking-tighter uppercase md:text-6xl">
            Your jams
          </h3>

          {hasSeveral ? (
            <Link
              href="/host/create"
              prefetch={false}
              aria-label="Add a new jam"
              className="
              group inline-flex h-10 shrink-0 items-center gap-2
              rounded-xl border border-[#1B1F2A] bg-white px-4
              text-sm font-bold tracking-tight text-[#1B1F2A]
              shadow-[3px_3px_0_0_rgba(27,31,42,0.45)]
              transition-[transform,box-shadow] duration-150 ease-out
              hover:shadow-[5px_5px_0_0_rgba(27,31,42,0.55)]
              active:translate-x-0.5 active:translate-y-0.5
              active:shadow-[1px_1px_0_0_rgba(27,31,42,0.45)]
            "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                aria-hidden="true"
                className="h-4 w-4 fill-current transition-transform duration-300 group-hover:rotate-90"
              >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
              Add jam
            </Link>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="h-1 w-14 shrink-0 bg-brand" />
          <p className="text-sm font-medium text-[#1B1F2A]/50">
            {hasSeveral ? `${jams.length} jams · ` : ''}
            Everything you&apos;ve put on the map.
          </p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <>
        {header}
        <div className="mt-10 flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </>
    );

  return (
    <>
      {header}
      <div className="mt-10 flex flex-col gap-4">
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
      border border-[#1B1F2A] bg-white
      shadow-[4px_4px_0_0_rgba(27,31,42,0.5)]
      transition-[transform,box-shadow] duration-150 ease-out
      hover:shadow-[6px_6px_0_0_rgba(27,31,42,0.6)]
      active:translate-x-0.5 active:translate-y-0.5
      active:shadow-[2px_2px_0_0_rgba(27,31,42,0.5)]
    "
          >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.03] pointer-events-none" />

            <div className="flex items-center gap-4">
              <div
                className="
  relative flex h-10 w-10 items-center justify-center 
  rounded-xl bg-zinc-900/00 border-2 text-black
  transition-all duration-500 ease-spring
  
  group-hover:bg-brand
  group-hover:rotate-90

  group-active:bg-brand
  group-active:rotate-90
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
                <span
                  className="
  text-xs text-zinc-500
  opacity-0 -translate-y-1
  transition-all duration-300
  
  group-hover:opacity-100
  group-hover:translate-y-0
  
  group-active:opacity-100
  group-active:translate-y-0
"
                >
                  Start a session
                </span>
              </div>
            </div>
          </Link>
        </div>

        {idToDelete ? <DeleteConfirmation /> : null}
      </div>
    </>
  );
}

import { Pencil, Eye, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

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
    /* The whole card is the "View" target now, via an overlay link rather than
       wrapping everything in an <a> — Edit is itself a link, and an anchor
       inside an anchor is invalid. The actions sit above it on z-10 so their
       clicks don't fall through to the card. */
    <div className="group relative flex items-center gap-3 rounded-2xl border border-[#1B1F2A]/12 bg-white p-3 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-20px_rgba(27,31,42,0.55)] md:gap-6 md:p-4">
      <Link
        href={`/jam/${jam_slug}`}
        prefetch={false}
        aria-label={`Open ${jam_title}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-[#1B1F2A]/40 focus-visible:outline-none"
      />

      {/* IMAGE — a square thumbnail on a phone, the 16:10 still from md up.
          It was 176px wide at every width, which on a 360px screen left about
          70px for the title once the padding, the two gaps and the menu button
          had taken their share: every jam on the list read as "Jam…". The photo
          is the least load-bearing thing in this row — you already know which
          jam it is from the name — so it is the one that gives up the space. */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 md:h-28 md:w-44">
        <Image
          src={jam_image_src}
          alt={jam_title}
          fill
          sizes="(max-width: 767px) 80px, 176px"
          className={`object-cover transition-transform duration-300 group-hover:scale-[1.04] ${
            !is_validated ? 'opacity-60' : 'opacity-100'
          }`}
        />

        {/* The badge does not fit an 80px thumbnail without covering it, and on
            a phone it would be saying what the amber line below already says. */}
        {!is_validated && (
          <div className="absolute top-2 left-2 hidden items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-md md:flex">
            <span className="flex h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white" />
            Pending
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Two lines on a phone rather than one clipped one: the row is as tall
            as the thumbnail anyway, so the second line is free. */}
        <h3 className="line-clamp-2 text-base font-extrabold tracking-tight wrap-anywhere md:truncate md:text-xl">
          {jam_title}
        </h3>
        <p className="mt-0.5 truncate text-[13px] font-medium text-[#1B1F2A]/55 md:mt-1 md:text-sm">
          {jam_adress}
        </p>
        {!is_validated && (
          <p className="mt-1 text-[11px] font-semibold text-amber-600 md:mt-2 md:text-xs">
            Waiting for review — not public yet
          </p>
        )}
      </div>

      {/* ACTIONS — View is gone: the card itself does that now, which leaves
          two real choices instead of three competing small buttons. */}
      <div className="relative z-10 hidden shrink-0 items-center gap-3 md:flex">
        <Link
          href={`/host/edit/${id}`}
          prefetch={false}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1B1F2A] bg-[#1B1F2A] px-6 text-sm font-bold tracking-tight text-white transition-colors duration-150 hover:bg-[#2E3440]"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => deleteJam(id)}
          aria-label={`Delete ${jam_title}`}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[#1B1F2A]/15 bg-white text-[#1B1F2A]/45 transition-colors duration-150 hover:border-red-600 hover:bg-red-600 hover:text-white"
        >
          <Trash2 className="size-4" strokeWidth={2} />
        </button>
      </div>

      {/* No wrapper: the menu carries its own z-index, and it has to be able
          to raise it. A fixed `z-10` here gave every card's menu the same
          layer, so the open one was still painted under the next card down —
          you could see the card below's trigger sitting on top of the list. */}
      <MobileMenu jam_slug={jam_slug} id={id} deleteJam={deleteJam} />
    </div>
  );
}
export function SkeletonCard() {
  return (
    <div className="flex items-center gap-6 rounded-2xl border border-[#1B1F2A]/12 bg-white p-4">
      <Skeleton className="h-28 w-44 shrink-0 rounded-xl" />
      <div className="w-4/10 space-y-2">
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <Skeleton className="h-4" />
      </div>
    </div>
  );
}

type MobileMenuProps = Pick<JamProps, 'jam_slug' | 'id' | 'deleteJam'>;

/** One row of the menu. Same box for the two links and the button. */
const MENU_ITEM =
  'flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm font-semibold tracking-tight transition-colors';

export function MobileMenu({ jam_slug, id, deleteJam }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on an outside press or on Escape. `pointerdown` rather than
  // `mousedown`: the same listener then covers a tap and a click, and it fires
  // before the card's overlay link can take the press.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    // z-10 to clear the card's own overlay link, and above every other card's
    // menu while this one is open — cards are siblings in one stacking context,
    // so equal z-index means the later card wins on DOM order alone.
    <div
      className={`relative md:hidden ${open ? 'z-30' : 'z-10'}`}
      ref={menuRef}
    >
      {/* The trigger used to be a translucent slate block with `px-1` and no
          height, so it was both off-palette on a white card and a target of
          about 24px — under the 44px a thumb needs. It is the same square as
          the desktop delete button now, borrowed outline and all. */}
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#1B1F2A]/40 focus-visible:outline-none ${
          open
            ? 'border-[#1B1F2A]/25 bg-[#1B1F2A]/8 text-[#1B1F2A]'
            : 'border-[#1B1F2A]/15 bg-white text-[#1B1F2A]/50 active:bg-[#1B1F2A]/5'
        }`}
      >
        <MoreHorizontalIcon className="size-5" strokeWidth={2.25} />
      </button>

      {open && (
        /* Was `w-28` holding 24px icons, which is why the labels had nowhere to
           go and "Delete" had been shortened to "Trash". At 11rem the icons
           drop to 16px, the rows get a 40px box each, and the words are the
           words. Delete sits under a rule, in red: the two safe actions read as
           a pair and the one that cannot be undone is not among them. */
        <div
          role="menu"
          aria-label="Jam actions"
          className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-xl border border-[#1B1F2A]/12 bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(27,31,42,0.35)]"
        >
          <Link
            href={`/jam/${jam_slug}`}
            prefetch={false}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`${MENU_ITEM} text-[#1B1F2A] active:bg-[#1B1F2A]/6`}
          >
            <Eye className="size-4 shrink-0 text-[#1B1F2A]/55" />
            View
          </Link>

          <Link
            href={`/host/edit/${id}`}
            prefetch={false}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`${MENU_ITEM} text-[#1B1F2A] active:bg-[#1B1F2A]/6`}
          >
            <Pencil className="size-4 shrink-0 text-[#1B1F2A]/55" />
            Edit
          </Link>

          <div className="my-1.5 h-px bg-[#1B1F2A]/8" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              deleteJam(id);
              setOpen(false);
            }}
            className={`${MENU_ITEM} cursor-pointer text-red-600 active:bg-red-50`}
          >
            <Trash2Icon className="size-4 shrink-0" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
