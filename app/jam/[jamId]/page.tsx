'use client';

import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Jam } from '../types/jam';
import draftToHtml from 'draftjs-to-html';
import { RawDraftContentState } from 'draft-js';
import SocialLinks from './SocialLinks';
import StaticMap from './LocationImageGMaps';
import TimeAndPlace from './TimeAndPlace';
import JamImages from './JamImages';
import JamChars from './JamChars';
import Link from 'next/link';

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
    <div className="min-h-screen ">
      <div className=" ">
        <div className="flex justify-between w-[1300px] max-w-[90%] mx-auto p-0">
          <Link href="/" className="ml-3 flex gap-2 items-end">
            <div
              className="ml-0 flex justify-end gap-2 items-end w-118 h-24 p-4 pb-2 pt-2 rounded-b-3xl
             shadow-[5px_0_6px_-1px_rgba(255,255,255,0.1),_-5px_0_6px_-1px_rgba(255,255,255,0.1),0_6px_6px_-1px_rgba(255,255,255,0.1)]"
            >
              <img
                src="jamspots_icon.png"
                alt="Jamspots icon"
                className="h-16"
              />
              <p className="text-xs py-4 text-text-2 font-semibold">
                Find the next spot where music happens.
              </p>
            </div>
          </Link>

          {/* <div className="w-16 h-16 ">
            <Avatar className="">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div> */}
        </div>
        <div className=" w-[1100px] max-w-[90%] mx-auto flex flex-col justify-center mt-18">
          <h3 className="text-5xl font-bold text-left mb-12 max-w-5/5 leading-relaxed">
            {jam.jam_title + ' at ' + jam.location_title}
          </h3>
        </div>
        <div className=" w-[1100px] max-w-[60%] mx-auto flex flex-col justify-center ">
          <JamImages images={jam.images.slice(0, 2)} />
        </div>
        <div className="flex gap-6 w-[1300px] max-w-[75%] mx-auto py-12 mt-12 ">
          <div className="bg-[rgb(170_170_170/0.1)] rounded-lg flex justify-center pt-8 pb-10 px-8 w-1/2 border border-white/30">
            <JamChars
              jamDetails={{
                styles: jam.styles,
                drums: jam.drums,
                lista_canciones: jam.lista_canciones,
                instruments_lend: jam.instruments_lend,
              }}
            />
          </div>

          <div className="bg-[rgb(170_170_170/0.1)] rounded-lg flex pt-8 pb-10 px-8 w-1/2 border border-white/30">
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

        <div className="flex flex-col gap-12 w-[1300px] max-w-[75%] mx-auto pb-12 ">
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

          <JamImages images={jam.images.slice(2, 4)} />
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

        <footer className="w-screen bg-bg/0 pb-12 mt-0 flex-1 ">
          <div className="flex items-center justify-center gap-12 max-w-[90%] w-[1300px] mx-auto p-6 pt-12 h-full border-t-2 border-primary-1">
            {/* Navigation Links */}
            <div className="flex flex-col text-tone-1/95 items-between justify-between gap-8 ">
              <Link
                href="/contact"
                className="hover:text-tone-0  cursor-pointer"
              >
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
    </div>
  );
}
