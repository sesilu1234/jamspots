'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import Link from 'next/link';

export default function SessionMenu() {
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSignIn(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute top-16 right-6 flex items-center gap-2">
      {session ? (
        <Link href="/jams_list_signIn">
          <div className="w-16 h-16 flex items-center cursor-pointer">
            <Avatar>
              <AvatarImage
                src={session.user?.image || 'https://github.com/shadcn.png'}
                className="rounded-full"
              />
              <AvatarFallback>
                {session.user?.name ? session.user.name[0] : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
      ) : (
        <>
          <button
            className="px-4 py-2 rounded-sm bg-[rgba(90,90,90,0.75)] text-white text-sm
                       transition-all duration-200
                       hover:bg-gray-900
                       hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.3)]
                       hover:-translate-y-1 cursor-pointer"
            onClick={() => signIn()}
          >
            + Añadir sitio
          </button>

          <div className="relative" ref={menuRef}>
            <div
              className="shadow-md hover:shadow-lg hover:bg-gray-700/70
                         transition-all duration-200 cursor-pointer px-2 py-1 rounded-sm bg-gray-900/30"
              onClick={() => setShowSignIn((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>

            {showSignIn && (
              <div className="absolute top-10 right-0 w-32 bg-gray-900/30 flex flex-col items-center gap-2 rounded-md z-50">
                <Link
                  href="/signIn_page"
                  className="pt-3 hover:underline cursor-pointer font-semibold"
                >
                  Sign In
                </Link>
                <div className="h-[1.5px] bg-gray-700/50 w-3/5 mt-1"></div>
                <span className="pb-3 hover:underline cursor-pointer font-[400]">
                  + Añadir sitio
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
