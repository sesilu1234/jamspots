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

export default function HomeComponent() {
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
    <div className="flex flex-col min-h-screen ">
      <MapProvider>
        <div className="relative flex flex-col  w-[1300px] max-w-[90%] mx-auto p-0 ">
          <SignInIcons />

          <div className="flex ">
            <div
              className="flex flex-col  justify-start  items-start pt-3 pb-4 pl-6 md:flex-row  md:gap-2  md:items-end  md:h-24 px-4 md:py-2 rounded-b-3xl
             shadow-[5px_0_6px_-1px_var(--tone-3),_-5px_0_6px_-1px_var(--tone-3),0_6px_6px_-1px_var(--tone-3)]"
            >
              <img
                src="jamspots_icon.png"
                alt="Jamspots icon"
                className="h-16"
              />
              <p className="text-xs  md:py-4 text-text-2 font-semibold">
                Find the next spot where music happens.
              </p>
            </div>

            {/* <div className="h-[1.5px] bg-foreground-1/50 w-96 mt-1 opacity-0"></div> */}
          </div>

          <div className="flex flex-wrap items-center mb-5 mt-6 ml-3 gap-2 max-w-full">
            {/* <Input
              className="w-72 h-10 px-3 text-sm text-gray-500 placeholder-gray-500 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="search"
              placeholder="Search jams, bars, venues…"
            /> */}

            <div className="w-52 ">
              <GooglePlacesSearch />
            </div>

            <div className=" ">
              <Filtro
                jams={jams}
                setJams={setJams}
                loading={loading}
                setLoading={setLoading}
                setSearchType={setSearchType}
              />
            </div>
          </div>

          <div className="flex justify-between items-end px-3 font-semibold uppercase tracking-wide text-xs md:text-lg">
            {searchType === 'local' ? (
              <span>{jams.length} jams found</span>
            ) : (
              <span>Showing jams worldwide</span>
            )}

            <div className="flex flex-col items-end">
              {searchType === 'local' ? (
                <span> Showing jams near you </span>
              ) : (
                <span> Showing global </span>
              )}
            </div>
          </div>

          <div className="relative w-full mx-auto mt-2 h-148 rounded-sm  shadow-md overflow-hidden">
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

      <div className="w-full mt-12 pt-4 pb-4">
        <div className="max-w-[90%] w-[1300px] mx-auto p-6 grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-2 border-t-2 border-primary-1 pt-8">
            <h3 className="text-lg font-semibold">WHAT IS A JAM SESSION?</h3>
            <p className="text-sm leading-relaxed">
              A jam session is a gathering where musicians hop on stage to play
              together, improvising and sharing music in the moment. You don’t
              need to know anyone beforehand—every night sounds different.
              Anyone can join in—or just hang out, feel the music, and have a
              good time.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm leading-relaxed border-t-2 border-primary-1 pt-8">
            <p>
              <span className="font-semibold">
                Can I play if it’s my first time?
              </span>{' '}
              → Absolutely! Anyone can get on stage to play or sing.
            </p>

            <p>
              <span className="font-semibold">
                Do I need to bring an instrument?
              </span>{' '}
              → Usually there’s a backline (drums, amp, mic), but bring yours if
              you want.
            </p>

            <p>
              <span className="font-semibold">Is there an entry fee?</span> →
              Most sessions are free or require just a minimum drink.
            </p>

            <p>
              <span className="font-semibold">
                What if I don’t play anything?
              </span>{' '}
              → You’re welcome too! Come to listen, relax, and soak up the vibe.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full pb-12 mt-0 flex-1 ">
        <div className="flex items-center justify-center gap-12 max-w-[90%] w-[1300px] mx-auto p-6 pt-12 h-full border-t-2 border-primary-1">
          {/* Navigation Links */}
          <div className="flex flex-col text-tone-1/95 items-between justify-between gap-8 ">
            <Link href="/contact" className="hover:text-tone-0  cursor-pointer">
              CONTACT
            </Link>
            <Link href="/help" className="hover:text-tone-0  cursor-pointer">
              HELP
            </Link>
            <Link href="/about" className="hover:text-tone-0  cursor-pointer">
              ABOUT
            </Link>
          </div>

          {/* Branding / Tagline */}
          <div className="flex flex-col sm:flex-row items-end justify-center gap-2 ">
            <img
              src="/jamspots_icon.png"
              alt="Jamspots icon"
              className="h-16"
            />
            <p className="text-sm  text-center font-medium sm:text-left pb-3">
              Find the next spot where music happens.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
