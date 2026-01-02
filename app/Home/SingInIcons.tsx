'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { User } from 'lucide-react';
import DropdownMenuAvatar from './AvatarCustom';
import DropdownMenuNotSignedIn from './AvatarCustom_notSignedIn';
import { useRouter } from 'next/navigation';

export default function SessionMenu() {
  const router = useRouter();
  const { data: session } = useSession();

  const menuRef = useRef<HTMLDivElement | null>(null);

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setShowSignIn(false);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <div className="absolute top-16 right-6 flex items-center gap-2 ">
      {session ? (
        <DropdownMenuAvatar session={session} />
      ) : (
        <>
          <button
            className="px-4 py-2 rounded-sm  text-text-3 text-sm
            border-2 border-tone-1 hidden md:block

                       transition-all duration-200
                       hover:bg-tone-3/25 
                       hover:shadow-[0_6px_20px_var(--tone-3),0_2px_3px_var(--tone-3)]
                       hover:-translate-y-1 cursor-pointer"
            onClick={() => router.push('/signIn')}
          >
            + Añadir sitio
          </button>

          <DropdownMenuNotSignedIn />
        </>
      )}
    </div>
  );
}
