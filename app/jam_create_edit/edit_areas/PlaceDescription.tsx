import { ChangeEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import React from 'react';
// Import the Slate editor factory.
import { createEditor } from 'slate';

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';

export default function PlaceDescription() {
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 1400) {
      toast('Máximo 1400 caracteres', {
        description: '',
        action: {
          label: 'Understood',
          onClick: () => console.log('Understood'),
        },
      });
      return; // don’t update state
    }
    setText(value);
  };

  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex justify-center m-3 ml-auto p-2 bg-black text-white w-32 rounded-lg cursor-pointer">
        Save and Exit
      </div>
      <Toaster />
      <div className="ml-48 mt-12">
        <div>
          {' '}
          <span className="font-semibold">Caracteres restantes: </span>{' '}
          {text.length} / 1400
        </div>
        <div className="min-h-132 w-128 bg-gray-600/40 mt-4 rounded-lg border-2 border-amber-600 p-4 flex">
          <textarea
            className="bg-gray-300/40 flex-1 resize-none outline-none p-2 rounded text-xs"
            value={text}
            onChange={handleChange}
          />
        </div>
        <div className="min-h-132 w-128 bg-gray-600/40 mt-4 rounded-lg border-2 border-amber-600 p-4 flex">
          <textarea
            className="bg-gray-300/40 flex-1 resize-none outline-none p-2 rounded text-xs"
            value={text}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
