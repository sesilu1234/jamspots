// page.tsx
'use client';
import React from 'react';
import { MapProvider } from './MapContext';

import dynamic from 'next/dynamic';
import GooglePlacesSearch from './GooglePlacesSearch';
import JamCarousel from './jamsCarousel';
import { Input } from '@/components/ui/input';
import { Menu } from 'lucide-react';

const MapRender = dynamic(() => import('./MapRender'), { ssr: false });

export default function Home() {
  return (
    <>
      <MapProvider>
        <div className="relative flex flex-col w-[1300px] max-w-[90%] mx-auto p-6 ">
          <div className="absolute top-16 right-6 flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-sm bg-[rgba(90,90,90,0.75)] text-white text-sm 
             transition-all duration-200 
             hover:bg-gray-900 
             hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.3)] 
             hover:-translate-y-1 cursor-pointer"
            >
              + Añadir sitio
            </button>

            <div
              className="px-2 py-1 rounded-sm bg-gray-900/30 shadow-md 
                hover:shadow-lg hover:bg-gray-700/70 transition-all duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
          </div>

          <div className="inline-block">
            <div className="ml-3 flex gap-2 items-end">
              <img
                src="jamspots_icon.png"
                alt="Jamspots icon"
                className="h-16"
              />
              <p className="text-xs py-3 text-gray-600 font-semibold">
                Find the next spot to share your sound.
              </p>
            </div>

            <div className="h-[1.5px] bg-gray-700/50 w-96 mt-1"></div>
          </div>

          <div className="flex items-center my-4 ml-3 gap-2">
            <Input
              className="w-72 h-10 px-3 text-sm text-gray-500 placeholder-gray-500 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              placeholder="Search jams, bars, venues…"
            />

            <div className="w-52 ">
              <GooglePlacesSearch />
            </div>
          </div>

          <div className="ml-3 font-semibold uppercase text-gray-800 tracking-wide">
            13 jams found
          </div>

          <div className="relative w-full mx-auto mt-4 h-148 rounded-sm border border-gray-500/70 shadow-md overflow-hidden">
            <MapRender />
            <JamCarousel />
          </div>
        </div>
      </MapProvider>

      <div className="w-screen bg-gray-200    mt-12     ">
        <div className="max-w-[90%] w-[1300px] mx-auto p-6  grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              ¿QUÉ ES UNA JAM SESSION?
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              Una jam es un encuentro donde músicos se suben al escenario a
              tocar juntos, improvisando y compartiendo música en el momento. No
              hace falta conocerse antes: cada noche suena diferente, y
              cualquiera puede participar o simplemente disfrutar escuchando.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600 leading-relaxed">
            <p>
              <span className="font-semibold text-gray-800">
                ¿Puedo tocar si nunca he venido antes?
              </span>{' '}
              → claro, cualquiera puede subir a tocar o cantar.
            </p>

            <p>
              <span className="font-semibold text-gray-800">
                ¿Hace falta llevar instrumento?
              </span>{' '}
              → normalmente hay backline (batería, ampli, micro), pero trae tu
              instrumento si quieres.
            </p>

            <p>
              <span className="font-semibold text-gray-800">
                ¿Hay entrada o es gratis?
              </span>{' '}
              → la mayoría son gratuitas o con consumición mínima.
            </p>

            <p>
              <span className="font-semibold text-gray-800">
                ¿Y si no toco nada?
              </span>{' '}
              → ¡Bienvenido igual! Ven a escuchar, relajarte y disfrutar del
              ambiente.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-screen bg-black/90 text-white py-12 mt-12">
        <div className="max-w-[90%] w-[1300px] mx-auto p-6">
          {/* Navigation Links */}
          <div className=" flex flex-row items-center justify-center   gap-48 mb-12 mt-12 ">
            <h3 className="hover:text-gray-300 cursor-pointer">CONTACT</h3>
            <h3 className="hover:text-gray-300 cursor-pointer">HELP</h3>
            <h3 className="hover:text-gray-300 cursor-pointer">ABOUT</h3>
          </div>

          {/* Branding / Tagline */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-24">
            <img src="jamspots_icon.png" alt="Jamspots icon" className="h-16" />
            <p className="text-sm text-gray-400 font-semibold text-center sm:text-left">
              Find the next spot to share your sound.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
