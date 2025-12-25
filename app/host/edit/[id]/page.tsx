'use client';

import React, { useRef } from 'react';
import EditSections from './EditSections';
import EditArea from './EditArea';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Home() {
  const childSaveOnUnmount = useRef<() => void>(() => {});
  const router = useRouter();

  return (
    <div className="flex bg-background text-primary">
      <div className="min-h-screen w-1/4 bg-[rgb(30,30,30)]">
        <Dialog>
          <DialogTrigger asChild>
            <button className="mx-8 my-24 flex items-center gap-4 text-white cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
              <h1 className="text-sm hover:underline">Back to home page</h1>
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px] bg-white text-primary">
            <DialogHeader>
              <DialogTitle className="">Leave without saving?</DialogTitle>
              <DialogDescription className="text-sm">
                Your changes haven’t been saved. If you leave now, they’ll be
                lost.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="ghost" className="border-1 border-black/60">
                  Stay
                </Button>
              </DialogClose>

              <Button
                variant="destructive"
                onClick={() => {
                  router.push('/host');
                }}
              >
                Leave anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <EditSections childSaveOnUnmount={childSaveOnUnmount} />
      </div>

      <div className="min-h-screen w-3/4 bg-white">
        <EditArea childSaveOnUnmount={childSaveOnUnmount} />
      </div>
    </div>
  );
}
