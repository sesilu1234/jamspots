

'use client';

import React, { useRef, useState } from 'react';
import EditSections from './EditSections';
import EditArea from './EditArea';
  import Link from 'next/link';

export default function Home() {


 const childSaveOnUnmount = useRef<() => void>(() => {});

  return (
    <div className="flex ">
      <div className="min-h-screen w-1/4 bg-[rgb(30,30,30)]">

      

<Link href="/jams_list_signIn">
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
    <h1 className="text-sm hover:underline ">Back to home page</h1>
  </button>
</Link>


        <EditSections childSaveOnUnmount={childSaveOnUnmount } />
      </div>

      <div className="min-h-screen w-3/4 bg-[#ffffff]">
        <EditArea  childSaveOnUnmount={childSaveOnUnmount } />
      </div>
    </div>
  );
}
