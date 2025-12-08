'use client';
import { useState, useRef, useEffect } from 'react';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

type SliderProps = React.ComponentProps<typeof Slider>;

export default function Filtro({
  coordinatesRef,
  jams,
  setJams,
  loading,
  setLoading,
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const calendarRef = useRef<HTMLDivElement | null>(null);

  type FiltroOptions = {
    ordenar: string;
    distancia: number;
    estilos: string[];
  };

  const filtroOptions = useRef<FiltroOptions>({
    ordenar: 'popular',
    distancia: 20,
    estilos: [],
  });
  const [dateOptions, setDateOptions] = useState('today');
  const [order, setOrder] = useState('popular');
  const [distance, setDistance] = useState(20);
  const [styles, setStyles] = useState<string[]>([]);

  const dateOptionsRef = useRef(dateOptions);
  dateOptionsRef.current = dateOptions;

  const orderRef = useRef(order);
  orderRef.current = order;

  const distanceRef = useRef(distance);
  distanceRef.current = distance;

  const stylesRef = useRef(styles);
  stylesRef.current = styles;

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  // Close on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        handleAccept();
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleAccept = () => {
    console.log('eiii');
    setLoading(true);
    fetchJams();
    setOpen(false);
  };

  const fetchJams = async () => {
    try {
      const clientDate = new Date();
      const year = clientDate.getFullYear();
      const month = String(clientDate.getMonth() + 1).padStart(2, '0');
      const day = String(clientDate.getDate()).padStart(2, '0');
      const localDateLocal = `${year}-${month}-${day}`;

      const params = new URLSearchParams({
        userDate: localDateLocal,
        dateOptions: dateOptionsRef.current,
        order: orderRef.current,
        lat: String(coordinatesRef.current.lat),
        lng: String(coordinatesRef.current.lng),
        distance: String(distanceRef.current),
        styles: JSON.stringify(stylesRef.current),
      });

      const res = await fetch(
        `/api/get-jams-cards-filtered?${params.toString()}`,
      );

      if (!res.ok) throw new Error('Failed to fetch jams');
      const data = await res.json();
      setJams(data);
      console.log('Fetched jams:', data);
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Filter button */}
      <div
        className="inline-flex items-center gap-2 px-2 py-1 h-10 justify-center shadow-md rounded-sm cursor-pointer
                   bg-gray-300 hover:bg-gray-600 group transition-colors duration-200"
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="19px"
          viewBox="0 -960 960 960"
          width="19px"
          className="fill-[rgba(17,17,17,0.8)] group-hover:fill-white transition-colors duration-200"
        >
          <path d="M120-40v-168q-35-12-57.5-42.5T40-320v-400h80v-160q0-17 11.5-28.5T160-920q17 0 28.5 11.5T200-880v160h80v400q0 39-22.5 69.5T200-208v168h-80Zm320 0v-168q-35-12-57.5-42.5T360-320v-400h80v-160q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v160h80v400q0 39-22.5 69.5T520-208v168h-80Zm320 0v-168q-35-12-57.5-42.5T680-320v-400h80v-160q0-17 11.5-28.5T800-920q17 0 28.5 11.5T840-880v160h80v400q0 39-22.5 69.5T840-208v168h-80ZM120-640v160h80v-160h-80Zm320 0v160h80v-160h-80Zm320 0v160h80v-160h-80ZM160-280q17 0 28.5-11.5T200-320v-80h-80v80q0 17 11.5 28.5T160-280Zm320 0q17 0 28.5-11.5T520-320v-80h-80v80q0 17 11.5 28.5T480-280Zm320 0q17 0 28.5-11.5T840-320v-80h-80v80q0 17 11.5 28.5T800-280ZM160-440Zm320 0Zm320 0Z" />
        </svg>
        <span className="text-md pt-0.5 transition-colors duration-200 font-jaro group-hover:text-white hover:cursor-pointer select-none">
          FILTER
        </span>
      </div>

      {/* Overlay + Filter Panel */}
      {open && (
        <div className="fixed inset-0 z-[503] flex justify-center items-start pt-20 bg-black/30">
          <div
            ref={panelRef}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-xl max-h-182 overflow-y-auto"
          >
            <h2 className="text-4xl font-bold mb-2 mt-2 text-gray-900 text-center  dark:text-white">
              Filters
            </h2>
            <div className="flex flex-col gap-12 p-6">
              <div className="flex flex-col ">
                <h1 className="text-3xl font-semibold">Cuándo</h1>
                <DateOptions
                  dateOptions={dateOptions}
                  setDateOption={setDateOptions}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-semibold">Ordenar</h1>
                <div className="flex flex-col pt-8 gap-4 ml-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={order === 'popular'}
                      onChange={(e) =>
                        setOrder(e.target.checked ? 'popular' : '')
                      }
                    />

                    <div
                      className="w-5 h-5 border-2 border-gray-400 rounded-md flex-shrink-0 
                  peer-checked:bg-blue-500 
                  transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="select-none">Más populares</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={order === 'closeness'}
                      onChange={(e) =>
                        setOrder(e.target.checked ? 'closeness' : '')
                      }
                    />
                    <div
                      className="w-5 h-5 border-2 border-gray-400 rounded-md flex-shrink-0 
                  peer-checked:bg-blue-500 
                  transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="select-none">Más cercanos</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col ">
                <div className="flex flex-col gap-4 ">
                  <label>
                    <SliderDemo distance={distance} setDistance={setDistance} />
                  </label>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-semibold">Estilos</h1>
                <div className="flex flex-col gap-4 ml-8">
                  <label>
                    <SelectStyles styles={styles} setStyles={setStyles} />
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap justify-end"></div>
            </div>
            <Button
              variant={'outline'}
              className="top-5 right-5 absolute bg-[rgb(216,138,74)] text-[rgb(34,33,33)] hover:bg-[rgb(63,62,62)] hover:text-[rgb(235,235,235)]"
              onClick={() => handleAccept()}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export function DateOptions({
  dateOptions,
  setDateOption,
  showCalendar,
  setShowCalendar,
}) {
  const calRef = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (calRef.current && !calRef.current.contains(e.target))
        setShowCalendar(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const options = [
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className="flex gap-3 pt-8 ml-8">
      {options.slice(0, 3).map((opt) => (
        <Button
          key={opt.value}
          variant={opt.value === dateOptions ? 'secondary' : 'outline'}
          className={`${opt.value === dateOptions ? 'border border-black/20' : ''} hover:bg-black/5`}
          onClick={() => setDateOption(opt.value)}
        >
          {opt.label}
        </Button>
      ))}

      <div className="relative" ref={calRef}>
        <Button
          variant={dateOptions.startsWith('custom') ? 'secondary' : 'outline'}
          className={`w-28 ${dateOptions.startsWith('custom') ? 'border border-black/20' : ''} hover:bg-black/5`}
          onClick={() => setShowCalendar((prev) => !prev)}
        >
          {dateOptions.startsWith('custom')
            ? dateOptions.split('custom: ')[1]
            : 'Custom'}
        </Button>

        {showCalendar ? <CalendarDemo setDateOption={setDateOption} /> : null}
      </div>
    </div>
  );
}

export function CalendarDemo({ setDateOption }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (date) {
      const localDate =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0');

      console.log('custom: ' + localDate);
      setDateOption('custom: ' + localDate);
    }
  }, [date]);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      startMonth={new Date(1990, 0)}
      endMonth={new Date(2104, 11)}
      className="rounded-md border shadow-sm absolute top-12 right-0 bg-gray-300 z-1"
      captionLayout="dropdown"
    />
  );
}

type SliderDemoProps = {
  distance: number;
  setDistance: (val: number) => void;
  className?: string;
};

export function SliderDemo({
  distance,
  setDistance,
  className,
}: SliderDemoProps) {
  return (
    <>
      <div className="flex gap-32 items-end mb-4">
        <h1 className="text-3xl font-semibold pb-4">Distancia</h1>
        <span className="pb-1">{distance}km</span>
      </div>

      <Slider
        value={[distance]} // <-- array necesario
        min={0}
        max={100}
        step={1}
        onValueChange={(val) => setDistance(val[0])} // <-- devolver número
        className={cn('w-[60%] ml-8', className)}
      />
    </>
  );
}

type SelectStylesProps = {
  styles: string[];
  setStyles: (val: string[]) => void;
};

export function SelectStyles({ styles, setStyles }: SelectStylesProps) {
  const toggleStyle = (style: string) => {
    if (styles.includes(style)) {
      setStyles(styles.filter((s) => s !== style));
    } else {
      setStyles([...styles, style]);
    }
  };
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
  return (
    <div className="grid grid-flow-col grid-rows-2 auto-cols-max gap-2 mt-4 border p-2 rounded max-w-3/4 overflow-x-auto">
      {all_styles.map((style) => {
        const isSelected = styles.includes(style);
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
  );
}
