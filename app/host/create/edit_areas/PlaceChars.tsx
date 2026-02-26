'use client';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlaceCharsProps } from './types/types';
import { useFormStore } from '../store/formStore';

const all_styles = [
  'Blues', 'Rock', 'All styles', 'Country', 'Jazz', 'Pop', 'Funk', 'Soul',
  'Reggae', 'Metal', 'Hip-Hop', 'R&B', 'Disco', 'House', 'Trance',
  'Electronic', 'Acoustic', 'Singer-Songwriter', 'Folk', 'Indie',
  'Alternative', 'Roots', 'Afro', 'Fusion', 'Latin', 'Improvisation',
];

export default function PlaceChars({ data, childSaveOnUnmount }: PlaceCharsProps) {
  const setForm = useFormStore((state) => state.setForm);
  const [search, setSearch] = useState('');
  const [modality, setModality] = useState<string>(data.modality);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(data.styles);
  const [song_list, setSongList] = useState<boolean>(data.song_list);
  const [instruments_lend, setIntrumentsLend] = useState<boolean>(data.intruments_lend);
  const [drums, setDrums] = useState<boolean>(data.drums);

  const refs = useRef({ modality, selectedStyles, song_list, instruments_lend, drums });
  useEffect(() => {
    refs.current = { modality, selectedStyles, song_list, instruments_lend, drums };
  }, [modality, selectedStyles, song_list, instruments_lend, drums]);

  function updateDataRef() {
    setForm((prev) => ({
      ...prev,
      features: {
        modality: refs.current.modality as 'open_mic' | 'jam',
        styles: refs.current.selectedStyles,
        song_list: refs.current.song_list,
        intruments_lend: refs.current.instruments_lend,
        drums: refs.current.drums,
      },
    }));
  }

  useEffect(() => {
    childSaveOnUnmount.current = updateDataRef;
    return () => { childSaveOnUnmount.current = () => {}; };
  }, []);

  const filteredStyles = all_styles.filter((style) =>
    style.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  return (
    /* Changed to solid bg-white to fix the "black background" issue on her phone */
    <div className="p-6 flex flex-col gap-3 bg-white text-black min-h-screen">
      {/* Changed ml-[10%] to mx-auto so it centers on all phones */}
      <div className="w-[95%] max-w-[600px] mx-auto">
        
        {/* --- MODALITY --- */}
        <div className="mb-8">
          <label className="block mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Event Modality
          </label>
          <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl gap-1">
            {['jam', 'open_mic'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setModality(option)}
                className={`px-4 sm:px-8 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                  modality === option
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-200/50'
                }`}
              >
                {option.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* --- STYLES --- */}
        <div className="flex justify-between">
          <span className="font-bold">Styles</span>
          <span>{selectedStyles.length} / 3</span>
        </div>

        <Input
          type="search"
          placeholder="Search for styles"
          /* Changed w-72 to w-full so it doesn't poke out the side of her screen */
          className="w-full mt-6 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mt-4 border p-2 rounded max-h-60 w-full overflow-y-auto">
          {filteredStyles.map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <div
                key={style}
                className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                onClick={() => toggleStyle(style)}
              >
                <span className="text-sm font-medium">{style}</span>
                <span className="ml-2 font-bold">{isSelected ? '×' : '+'}</span>
              </div>
            );
          })}
        </div>

        {selectedStyles.length > 0 && (
          <div className="mt-4 text-sm">
            <span className="font-semibold">Selected: </span>
            {selectedStyles.join(', ')}
          </div>
        )}

        {/* --- TOGGLES --- */}
        <div className="flex flex-col gap-6 mt-16">
          {[
            { label: 'Is there a setlist?', state: song_list, setter: setSongList },
            { label: 'Instruments available?', state: instruments_lend, setter: setIntrumentsLend },
            { label: 'Is there a drum kit?', state: drums, setter: setDrums },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-wrap items-center justify-between gap-4">
              <span className="w-full sm:w-48 font-semibold">{item.label}</span>
              <div className="flex gap-2">
                <Button
                  variant={null}
                  className={`w-16 ${item.state ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}
                  onClick={() => item.setter(true)}
                >
                  Yes
                </Button>
                <Button
                  variant={null}
                  className={`w-16 ${!item.state ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}
                  onClick={() => item.setter(false)}
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}