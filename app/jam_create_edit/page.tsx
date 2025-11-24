

'use client';

import React, { useRef, useState } from 'react';
import EditSections from './EditSections';
import EditArea from './EditArea';

export default function Home() {


 const childSaveOnUnmount = useRef<() => void>(() => {});

  return (
    <div className="flex ">
      <div className="min-h-screen w-1/4 bg-[rgb(30,30,30)]">
        <EditSections childSaveOnUnmount={childSaveOnUnmount } />
      </div>

      <div className="min-h-screen w-3/4 bg-[#ffffff]">
        <EditArea  childSaveOnUnmount={childSaveOnUnmount } />
      </div>
    </div>
  );
}
