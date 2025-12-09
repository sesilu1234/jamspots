'use client';

import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Jam } from '../types/jam';
import draftToHtml from 'draftjs-to-html';
import { RawDraftContentState } from 'draft-js';
import SocialLinks from './SocialLinks';
import StaticMap from './LocationImageGMaps';
import TimeAndPlace from './TimeAndPlace';
import JamImages from './JamImages';
import JamChars from './JamChars';

interface HtmlReadOnlyProps {
  rawContent: RawDraftContentState;
}

const HtmlReadOnly = ({ rawContent }: HtmlReadOnlyProps) => {
  const html = draftToHtml(rawContent);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function JamPage() {
  const params = useParams();
  const jamId = params.jamId;

  const [jam, setJam] = useState<Jam | null>(null);

  useEffect(() => {
    async function fetchJam() {
      const res = await fetch(`/api/get-jam/${jamId}`);
      const data = await res.json();
      setJam(data);
  
      console.log(Object.keys(data!));
      // <-- log here, after fetch
    }
    fetchJam();
  }, [jamId]);

  if (!jam) return null;

  return (
    <div className="min-h-screen bg-black/90">
      <div className=" bg-gray-300 ">
        <div className="flex justify-between w-[1300px] max-w-[90%] mx-auto py-12">
          <div className="ml-3 flex gap-2 items-end">
            <img
              src="/jamspots_icon.png"
              alt="Jamspots icon"
              className="h-16"
            />
            <p className="relative bottom-0 text-xs py-3 text-gray-600 font-semibold">
              Discover a spot where musicians unite.
            </p>
          </div>

          <div className="w-16 h-16 ">
            <Avatar className="">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="w-[1100px] max-w-[60%] mx-auto flex flex-col">
          <h3 className="text-5xl font-bold">
            {jam.jam_title + ' at ' + jam.location_title}
          </h3>

          <JamImages images={jam.images} />
        </div>
        <div className="flex gap-2 w-[1300px] max-w-[75%] mx-auto py-12 ">
          <JamChars
            jamDetails={{
              styles: jam.styles,
              drums: jam.drums,
              lista_canciones: jam.lista_canciones,
              instruments_lend: jam.instruments_lend,
            }}
          />

          <div className="bg-[rgb(170_170_170/0.7)] rounded-lg flex pt-8 pb-10 px-8 w-1/2">
            <TimeAndPlace
              location_title={jam.location_title}
              address={jam.location_address}
              fallbackLat={jam.lat}
              fallbackLng={jam.lng}
              date={jam.dates[0]}
              time={jam.time_start}
            />
          </div>
        </div>

        <div className="flex  gap-2 w-[1300px] max-w-[75%] mx-auto pb-12 ">
          <div className="flex flex-col gap-4 bg-[rgb(170_170_170/0.7)] rounded-lg pt-8 pb-10 px-8 w-1/2">
            <h3 className="text-3xl font-semibold">Details</h3>

            <div>
              <HtmlReadOnly rawContent={jam.description} />
            </div>
          </div>

          <StaticMap
            address={jam.location_address}
            fallbackLat={jam.lat}
            fallbackLng={jam.lng}
            apiKey="AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE"
          />
        </div>

        <div className="w-[1300px] max-w-[75%] mx-auto pb-24  ">
          <SocialLinks socialLinks={jam.social_links} />
        </div>

        <div className="relative w-[1300px] max-w-[75%] mx-auto pb-24">
          <span className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-3xl">
            Disabled
          </span>

          <div className="flex flex-col gap-8  bg-[rgb(170_170_170/0.7)]  p-6  rounded-lg opacity-40">
            <h3 className="text-2xl">Questions</h3>
            <p className="opacity-70">
              Ask any question you want to the jam´s host
            </p>
          </div>
        </div>

        <footer className=" flex-grow  w-screen bg-black/90 text-white py-12 mt-12">
          <div className="flex-1 max-w-[90%] w-[1300px] mx-auto p-6">
            {/* Navigation Links */}
            <div className=" flex flex-row items-center justify-center   gap-48 mb-12 mt-12 ">
              <h3 className="hover:text-gray-300 cursor-pointer">CONTACT</h3>
              <h3 className="hover:text-gray-300 cursor-pointer">HELP</h3>
              <h3 className="hover:text-gray-300 cursor-pointer">ABOUT</h3>
            </div>

            {/* Branding / Tagline */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-24">
              <img
                src="/jamspots_icon.png"
                alt="Jamspots icon"
                className="h-16"
              />
              <p className="text-sm text-gray-400 font-semibold text-center sm:text-left">
                Discover places where music comes alive.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
