// page.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MapProvider } from './MapContext';

import dynamic from 'next/dynamic';
import GooglePlacesSearch from './GooglePlacesSearch';
import JamCarousel from './jamsCarousel';
import { Input } from '@/components/ui/input';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import SignInIcons from './SingInIcons';
import Filtro from './Filtro';

const MapRender = dynamic(() => import('./MapRender'), { ssr: false });

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const menuRef = useRef(null);

  const [jams, setJams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchType, setSearchType] = useState('local');

  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuRef.current?.contains(e.target)) {
        setShowSignIn(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-1">
      <MapProvider>
        <div className="relative flex flex-col  w-[1300px] max-w-[90%] mx-auto p-6 ">
          <SignInIcons />

          <div className="inline-block">
            <div className="ml-3 flex gap-2 items-end">
              <img
                src="jamspots_icon.png"
                alt="Jamspots icon"
                className="h-16"
              />
              <p className="text-xs py-3 text-text-2 font-semibold">
                Find the next spot where music happens.
              </p>
            </div>

            <div className="h-[1.5px] bg-foreground-1/50 w-96 mt-1"></div>
          </div>

          <div className="flex items-center mb-5 mt-8 ml-3 gap-2">
            {/* <Input
              className="w-72 h-10 px-3 text-sm text-gray-500 placeholder-gray-500 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              placeholder="Search jams, bars, venues…"
            /> */}

            <div className="w-52 ">
              <GooglePlacesSearch />
            </div>

            <div className="w-52 ">
              <Filtro
                jams={jams}
                setJams={setJams}
                loading={loading}
                setLoading={setLoading}
                setSearchType={setSearchType}
              />
            </div>
          </div>

          <div className="flex justify-between items-end px-3 font-semibold uppercase text-text-1 tracking-wide">
            <span> 13 jams found</span>
            <div className="flex flex-col items-end">
              {searchType === 'local' ? (
                <span> Showing jams near you </span>
              ) : (
                <span> Showing global jams </span>
              )}
            </div>
          </div>

          <div className="relative w-full mx-auto mt-2 h-148 rounded-sm border border-gray-500/70 shadow-md overflow-hidden">
            <MapRender />
            <JamCarousel
              jams={jams}
              setJams={setJams}
              loading={loading}
              setLoading={setLoading}
              searchType={searchType}
            />
          </div>
        </div>
      </MapProvider>

      <div className="w-screen bg-background-2    mt-12 pt-4 pb-4     ">
        <div className="max-w-[90%] w-[1300px] mx-auto p-6  grid grid-cols-2 gap-12 text-text-1 ">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-text-1">
              ¿QUÉ ES UNA JAM SESSION?
            </h3>

            <p className="text-sm leading-relaxed">
              Una jam es un encuentro donde músicos se suben al escenario a
              tocar juntos, improvisando y compartiendo música en el momento. No
              hace falta conocerse antes: cada noche suena diferente, y
              cualquiera puede participar o simplemente disfrutar escuchando.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm  leading-relaxed">
            <p>
              <span className="font-semibold text-text-1">
                ¿Puedo tocar si nunca he venido antes?
              </span>{' '}
              → claro, cualquiera puede subir a tocar o cantar.
            </p>

            <p>
              <span className="font-semibold ">
                ¿Hace falta llevar instrumento?
              </span>{' '}
              → normalmente hay backline (batería, ampli, micro), pero trae tu
              instrumento si quieres.
            </p>

            <p>
              <span className="font-semibold ">¿Hay entrada o es gratis?</span>{' '}
              → la mayoría son gratuitas o con consumición mínima.
            </p>

            <p>
              <span className="font-semibold text-text-1">
                ¿Y si no toco nada?
              </span>{' '}
              → ¡Bienvenido igual! Ven a escuchar, relajarte y disfrutar del
              ambiente.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-screen bg-footer text-text-3 py-12 mt-0 flex-1 ">
        <div className="max-w-[90%] w-[1300px] mx-auto p-6 h-full">
          {/* Navigation Links */}
          <div className="flex flex-row items-center justify-center gap-16 mb-12">
            <Link
              href="/contact"
              className="hover:text-text-hover-1 cursor-pointer"
            >
              CONTACT
            </Link>
            <Link
              href="/help"
              className="hover:text-text-hover-1 cursor-pointer"
            >
              HELP
            </Link>
            <Link
              href="/about"
              className="hover:text-text-hover-1 cursor-pointer"
            >
              ABOUT
            </Link>
          </div>

          {/* Branding / Tagline */}
          <div className="flex flex-col sm:flex-row items-end justify-center gap-2 mt-12">
            <img
              src="/jamspots_icon.png"
              alt="Jamspots icon"
              className="h-16"
            />
            <p className="text-sm text-text-4 text-center font-medium sm:text-left pb-3">
              Find the next spot where music happens.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
