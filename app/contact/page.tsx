'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');

  const sendData = async () => {
    await fetch('/api/users-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg, email }),
    });
  };

  return (
    <div className="w-[1300px] max-w-[90%] mx-auto p-6">
      <div className="inline-block">
        <div className="ml-3 flex gap-2 items-end">
          <img src="jamspots_icon.png" alt="Jamspots icon" className="h-16" />
          <p className="text-xs py-3 text-gray-600 font-semibold">
            Find the next spot to share your sound.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12 p-12">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
          <p>This is the Contact page.</p>
        </div>

        <div className="w-128 mt-24 flex flex-col space-y-4">
          <div className="flex justify-between ">
            <Button
              className="self-start hover:bg-amber-400"
              variant="outline"
              onClick={sendData}
            >
              Submit
            </Button>
          </div>

          <textarea
            className="w-full h-64 p-8 border bg-gray-200 border-gray-400 rounded resize-none"
            placeholder="Write your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-sm border bg-gray-200 border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none text-md leading-tight"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
