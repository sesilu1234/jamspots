'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');

  const sendData = async () => {
    await fetch('/api/public/users-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg, email }),
    });
  };

  return (
    <div className="w-[1300px] max-w-[90%] mx-auto p-6">
      <div className="inline-block">
        <Link href="/">
          <div className="ml-3 flex gap-2 items-end">
            <img src="jamspots_icon.png" alt="Jamspots icon" className="h-16" />
            <p className="text-xs py-3 text-gray-600 font-semibold">
              Find the next spot where music happens.
            </p>
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-6 p-12 ">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
          <p>This is the Contact page.</p>
        </div>

        <div className="w-128 mt-0 flex flex-col space-y-4">
          <div className="flex justify-between ">
            <Button
              className="self-start hover:opacity-90 hover:cursor-pointer hover:text-tone-0 hover:border-tone-0"
              variant="outline"
              onClick={sendData}
            >
              Submit
            </Button>
          </div>

          <textarea
            className="w-full h-64 p-8 border bg-white text-black border-gray-400 rounded resize-none"
            placeholder="Write your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-6/8 mx-auto px-2 py-2 rounded-sm border bg-white text-black border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none text-md leading-tight"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
