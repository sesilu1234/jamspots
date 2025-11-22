import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const all_styles = [
  // Musical styles
  'Blues',
  'Rock',
  'Country',
  'Jazz',
  'Pop',
  'Funk',
  'Soul',
  'Reggae',
  'Metal',
  'Hip-Hop',
  'R&B',
  'Disco',
  'House',
  'Trance',
  'Electronic',
  'Acoustic',
  'Singer-Songwriter',
  'Folk',
  'Indie',
  'Alternative',
  'Roots',
  'Afro',
  'Fusion',
  'Latin',

  // Moods / vibes
  'Improvisation',
  'Open Mic',
];

export default function PlaceChars() {
  const [search, setSearch] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const filteredStyles = all_styles.filter((style) =>
    style.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex justify-center m-3 ml-auto p-2 bg-black text-white w-32 rounded-lg cursor-pointer">
        Save and Exit
      </div>

      <div className="max-w-[70%] ml-[10%]">
        <div className="flex justify-between">
          <span>Estilos</span>
          <span>{selectedStyles.length} / 3</span>
        </div>

        <Input
          type="search"
          placeholder="Search for styles"
          className="w-72 mt-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mt-4 border p-2 rounded max-h-60 w-3/4 overflow-y-auto">
          {filteredStyles.map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <div
                key={style}
                className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => toggleStyle(style)}
              >
                <span>{style}</span>
                <span className="font-bold ml-1">{isSelected ? '×' : '+'}</span>
              </div>
            );
          })}
        </div>

        {selectedStyles.length > 0 && (
          <div className="mt-4">
            <span className="font-semibold">Selected Styles: </span>
            {selectedStyles.join(', ')}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-16">
          <div className="flex  items-center gap-6">
            {' '}
            <span className="w-48 font-semibold ">Hay lista de canciones?</span>
            <Button variant="outline" className="w-12">
              Sí
            </Button>
            <Button variant="outline" className="w-12">
              No
            </Button>
          </div>
          <div className="flex items-center gap-6">
            {' '}
            <span className="w-48 font-semibold ">Se prestan intrumentos?</span>
            <Button variant="outline" className="w-12">
              Sí
            </Button>
            <Button variant="outline" className="w-12">
              No
            </Button>
          </div>
          <div className="flex  items-center gap-6">
            {' '}
            <span className="w-48 font-semibold ">Hay bateria?</span>
            <Button variant="outline" className="w-12">
              Sí
            </Button>
            <Button variant="outline" className="w-12">
              No
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
