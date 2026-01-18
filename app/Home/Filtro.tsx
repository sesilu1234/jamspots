'use client';
import { useState, useRef, useEffect } from 'react';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { clusterGroup } from './MarkerCluster';
import { useMapContext } from './MapContext';

import L from 'leaflet';

type SliderProps = React.ComponentProps<typeof Slider>;

export default function Filtro({
  jams,
  setJams,
  loading,
  setLoading,
  setSearchType,
}) {
  const [open, setOpen] = useState(false);
  const panelRef_1 = useRef<HTMLDivElement | null>(null);
  const panelRef_2 = useRef<HTMLDivElement | null>(null);
  const panelRef_3 = useRef<HTMLDivElement | null>(null);

  const calendarRef = useRef<HTMLDivElement | null>(null);

  const [dateOptions, setDateOptions] = useState('week');
  const [order, setOrder] = useState('popular');
  const [distance, setDistance] = useState(40);
  const [styles, setStyles] = useState<string[]>([]);

  const [dateOptionsGlobal, setdateOptionsGlobal] = useState('all');
  const [stylesGlobal, setstylesGlobal] = useState<string[]>([]);

  const dateOptionsHold = useRef('week');
  const orderHold = useRef('popular');
  const distanceHold = useRef(40);
  const stylesHold = useRef<string[]>([]);

  const dateOptionsGlobalHold = useRef('all');
  const stylesGlobalHold = useRef<string[]>([]);

  const dateOptionsRef = useRef(dateOptions);
  dateOptionsRef.current = dateOptions;

  const orderRef = useRef(order);
  orderRef.current = order;

  const distanceRef = useRef(distance);
  distanceRef.current = distance;

  const stylesRef = useRef(styles);
  stylesRef.current = styles;

  const dateOptionsRefGlobal = useRef(dateOptionsGlobal);
  dateOptionsRefGlobal.current = dateOptionsGlobal;

  const stylesRefGlobal = useRef(stylesGlobal);
  stylesRefGlobal.current = stylesGlobal;

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const [showCalendarMap, setShowCalendarMap] = useState<boolean>(false);

  const [cardFiltersOpen, setCardFiltersOpen] = useState(true);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [dateGlobal, setdateGlobal] = useState<Date | undefined>(new Date());

  const { locationSearch, setMarkersData, map } = useMapContext();

  // Close on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !panelRef_1.current?.contains(event.target as Node) &&
        !panelRef_2.current?.contains(event.target as Node) &&
        !panelRef_3.current?.contains(event.target as Node)
      ) {
        setDateOptions(dateOptionsHold.current);
        setOrder(orderHold.current);
        setDistance(distanceHold.current);
        setStyles([...stylesHold.current]);

        setdateOptionsGlobal(dateOptionsGlobalHold.current);
        setstylesGlobal([...stylesGlobalHold.current]);
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDateOptions(dateOptionsHold.current);
        setOrder(orderHold.current);
        setDistance(distanceHold.current);
        setStyles([...stylesHold.current]);

        setdateOptionsGlobal(dateOptionsGlobalHold.current);
        setstylesGlobal([...stylesGlobalHold.current]);
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

  const handleAccept = (searchType: string) => {
    setSearchType(searchType);
    fetchJams(searchType);

    if (searchType === 'local') {
      // sync state → refs
      dateOptionsHold.current = dateOptions;
      orderHold.current = order;
      distanceHold.current = distance;
      stylesHold.current = [...styles];

      map!.flyTo(
        [locationSearch?.coordinates.lat, locationSearch?.coordinates.lng],
        12,
        { duration: 1.5 },
      );
    } else {
      // sync state → refs
      dateOptionsGlobalHold.current = dateOptionsGlobal;
      stylesGlobalHold.current = [...stylesGlobal];

      map!.flyTo(
        [locationSearch?.coordinates.lat, locationSearch?.coordinates.lng],
        6,
        { duration: 1.5 },
      );
    }

    setOpen(false);
  };

  const fetchJams = async (searchType) => {
    try {
      const clientDate = new Date();
      const year = clientDate.getFullYear();
      const month = String(clientDate.getMonth() + 1).padStart(2, '0');
      const day = String(clientDate.getDate()).padStart(2, '0');
      const localDateLocal = `${year}-${month}-${day}`;

      if (searchType === 'local') {
        setLoading(true);

        const paramsCards = new URLSearchParams({
          userDate: localDateLocal,
          dateOptions: dateOptionsRef.current,
          order: String(orderRef.current),
          lat: String(locationSearch?.coordinates.lat),
          lng: String(locationSearch?.coordinates.lng),
          distance: String(distanceRef.current),
          styles: JSON.stringify(stylesRef.current),
        });

        const cardsFetch = await fetch(
          `/api/public/get-jams-cards-filtered?${paramsCards}`,
        );

        if (!cardsFetch.ok) throw new Error('Failed to fetch jams');

        const resCards = await cardsFetch.json();

        setMarkersData(
          resCards?.map((jam) => ({
            id: jam.id,
            lat: jam.lat,
            lng: jam.lng,
          })),
        );
        setJams(resCards);
      }

      if (searchType === 'global') {
        const paramsMarkers = new URLSearchParams({
          userDate: localDateLocal,
          dateOptions: dateOptionsRefGlobal.current,
          styles: JSON.stringify(stylesRefGlobal.current),
        });

        const markersFetch = await fetch(
          `/api/public/get-jams-markers-filtered?${paramsMarkers}`,
        );

        if (!markersFetch.ok) throw new Error('Failed to fetch jams');

        const resMarkers = await markersFetch.json();
        setMarkersData(resMarkers);
        setJams([]);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationSearch) {
      setSearchType('local');
      fetchJams('local');
    }
  }, [locationSearch]);

  return (
    <>
      {/* Filter button */}
      <div
        onClick={() => setOpen(!open)}
        className="
    inline-flex items-center gap-2 px-3 h-10
    rounded border border-tone-3
    bg-tone-3
    text-black
    cursor-pointer select-none
    hover:bg-tone-4
    hover:text-primary-1
    transition-colors
    group
  "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="19px"
          viewBox="0 -960 960 960"
          width="19px"
          className=" transition-colors duration-200  "
        >
          <path
            d="M120-40v-168q-35-12-57.5-42.5T40-320v-400h80v-160q0-17 11.5-28.5T160-920q17 0 28.5 11.5T200-880v160h80v400q0 39-22.5 69.5T200-208v168h-80Zm320 0v-168q-35-12-57.5-42.5T360-320v-400h80v-160q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v160h80v400q0 39-22.5 69.5T520-208v168h-80Zm320 0v-168q-35-12-57.5-42.5T680-320v-400h80v-160q0-17 11.5-28.5T800-920q17 0 28.5 11.5T840-880v160h80v400q0 39-22.5 69.5T840-208v168h-80ZM120-640v160h80v-160h-80Zm320 0v160h80v-160h-80Zm320 0v160h80v-160h-80ZM160-280q17 0 28.5-11.5T200-320v-80h-80v80q0 17 11.5 28.5T160-280Zm320 0q17 0 28.5-11.5T520-320v-80h-80v80q0 17 11.5 28.5T480-280Zm320 0q17 0 28.5-11.5T840-320v-80h-80v80q0 17 11.5 28.5T800-280ZM160-440Zm320 0Zm320 0Z"
            className="fill-current"
          />
        </svg>
        <span className="text-md text-tone-0/85  transition-colors duration-200 font-semibold group-hover:text-primary-1 hover:cursor-pointer select-none">
          FILTER
        </span>
      </div>

      {/* Overlay + Filter Panel */}
      {open && (
        <div className="fixed inset-0 z-[503] flex flex-col  items-center pt-5 ">
          <div className="relative   max-w-[80%] md:w-xl ">
            <div
              ref={panelRef_1}
              className="flex w-fit justify-center items-end gap-0 mx-auto text-tone-6"
            >
              <div
                className={`pt-5 pb-2 px-2 bg-white text-black w-30 md:w-40 rounded-t-xl text-center cursor-pointer ${
                  cardFiltersOpen
                    ? ''
                    : ' border-3 md:border-4 border-tone-3/40'
                }`}
                onClick={() => setCardFiltersOpen(true)}
              >
                Local
              </div>

              <div
                className={`pt-5 pb-2 px-2 bg-white text-black w-30 md:w-40 rounded-t-xl text-center cursor-pointer ${
                  cardFiltersOpen
                    ? 'border-3 md:border-4  border-tone-3/40'
                    : ''
                }`}
                onClick={() => setCardFiltersOpen(false)}
              >
                Global
              </div>
            </div>

            {cardFiltersOpen ? (
              <div
                ref={panelRef_2}
                className="relative bg-white text-black  p-6 rounded-md shadow-lg overflow-y-scroll h-[70vh] "
              >
                <div className="flex justify-center items-center gap-24  mb-5 mt-5">
                  <h2 className="text-4xl font-bold text-center  text-text-secondary">
                    Local
                  </h2>
                  <button
                    onClick={() => handleAccept('local')}
                    className="absolute right-5 md:right-10 top-5 rounded-md border border-black/20 px-4 py-2
            bg-secondary-1 hover:bg-secondary-1/75 hover:border-black/80 text-black font-semibold 
             transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-col gap-12 md:pl-4">
                  <div className="flex flex-col ">
                    <h1 className="text-2xl md:text-3xl font-semibold">When</h1>
                    <DateOptions
                      dateOptions={dateOptions}
                      setDateOption={setDateOptions}
                      showCalendar={showCalendar}
                      setShowCalendar={setShowCalendar}
                      dateRef={date}
                      setDate={setDate}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl  font-semibold">
                      Sort
                    </h1>
                    <div className="flex flex-col pt-8 gap-4 ml-8">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="order"
                          className="hidden peer"
                          checked={order === 'popular'}
                          onChange={() => setOrder('popular')}
                        />
                        <div
                          className="w-5 h-5 border-2 border-tone-2 rounded-md flex-shrink-0 
      peer-checked:bg-cyan-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 opacity-0 "
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="select-none">Most popular</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="order"
                          className="hidden peer"
                          checked={order === 'closeness'}
                          onChange={() => setOrder('closeness')}
                        />
                        <div
                          className="w-5 h-5 border-2 border-tone-2 rounded-md flex-shrink-0 
      peer-checked:bg-cyan-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3  opacity-0 "
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="select-none">Closest</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <div className="flex flex-col gap-4 ">
                      <label>
                        <SliderDemo
                          distance={distance}
                          setDistance={setDistance}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl  font-semibold">
                      Styles
                    </h1>
                    <div className="flex flex-col gap-4 ml-8">
                      <label>
                        <SelectStyles styles={styles} setStyles={setStyles} />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end"></div>
                </div>
                {/* <Button
              variant={'outline'}
              className="top-5 right-5 absolute bg-[rgb(216,138,74)] text-[rgb(34,33,33)] hover:bg-[rgb(63,62,62)] hover:text-[rgb(235,235,235)]"
              onClick={() => handleAccept()}
            >
              Close
            </Button> */}
              </div>
            ) : (
              <div
                ref={panelRef_3}
                className="relative bg-white text-black   p-6 rounded-md shadow-lg h-[70vh] overflow-y-scroll"
              >
                <div className="flex justify-center items-center gap-24 mb-5 mt-5">
                  <h2 className="text-4xl font-bold  text-text-secondary  text-center">
                    Global
                  </h2>
                  <button
                    onClick={() => handleAccept('global')}
                    className="absolute right-5 md:right-10  top-5 rounded-md border border-black/20 px-4 py-2
            bg-secondary-1 hover:bg-secondary-1/75  hover:border-black/80 text-black  font-semibold 
             transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-col gap-12 md:pl-4">
                  <div className="flex flex-col ">
                    <h1 className="text-2xl md:text-3xl  font-semibold">
                      When
                    </h1>
                    <DateOptionsGlobal
                      dateOptions={dateOptionsGlobal}
                      setDateOption={setdateOptionsGlobal}
                      showCalendar={showCalendarMap}
                      setShowCalendar={setShowCalendarMap}
                      dateRef={dateGlobal}
                      setDate={setdateGlobal}
                    />
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl  font-semibold">
                      Styles
                    </h1>
                    <div className="flex flex-col gap-4 ml-8">
                      <label>
                        <SelectStyles
                          styles={stylesGlobal}
                          setStyles={setstylesGlobal}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-start mt-8 font-light">
                    This search will hide cards and show all jam markers in the
                    whole world.
                  </div>
                </div>
              </div>
            )}
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
  dateRef,
  setDate,
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
    <div className="flex flex-wrap  gap-3 pt-8 ml-8">
      {options.slice(0, 3).map((opt) => (
        <Button
          key={opt.value}
          variant={opt.value === dateOptions ? 'secondary' : undefined}
          className={`text-lg ${
            opt.value === dateOptions ? 'hover:bg-black hover:text-white' : ''
          }`}
          onClick={() => setDateOption(opt.value)}
        >
          {opt.label}
        </Button>
      ))}

      <div className="relative" ref={calRef}>
        <Button
          className={`text-lg ${
            dateOptions.startsWith('custom')
              ? 'hover:bg-black hover:text-white'
              : ''
          }`}
          variant={dateOptions.startsWith('custom') ? 'secondary' : undefined}
          onClick={() => setShowCalendar((prev) => !prev)}
        >
          {dateOptions.startsWith('custom')
            ? dateOptions.split('custom: ')[1]
            : 'Custom'}
        </Button>

        {showCalendar ? (
          <CalendarDemo
            setDateOption={setDateOption}
            dateRef={dateRef}
            setDate={setDate}
          />
        ) : null}
      </div>
    </div>
  );
}

export function DateOptionsGlobal({
  dateOptions,
  setDateOption,
  showCalendar,
  setShowCalendar,
  dateRef,
  setDate,
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
    { value: 'all', label: 'Show all' },
    { value: 'week', label: 'This week' },
  ];

  return (
    <div className="flex flex-wrap  gap-3 pt-8 ml-8">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={opt.value === dateOptions ? 'secondary' : undefined}
          onClick={() => setDateOption(opt.value)}
          className={`text-lg ${
            opt.value === dateOptions ? 'hover:bg-black hover:text-white' : ''
          }`}
        >
          {opt.label}
        </Button>
      ))}

      <div className="relative" ref={calRef}>
        <Button
          variant={dateOptions.startsWith('custom') ? 'secondary' : undefined}
          onClick={() => setShowCalendar((prev) => !prev)}
          className={`text-lg ${
            dateOptions.startsWith('custom')
              ? 'hover:bg-black hover:text-white'
              : ''
          }`}
        >
          {dateOptions.startsWith('custom')
            ? dateOptions.split('custom: ')[1]
            : 'Custom'}
        </Button>

        {showCalendar ? (
          <CalendarDemo
            setDateOption={setDateOption}
            dateRef={dateRef}
            setDate={setDate}
          />
        ) : null}
      </div>
    </div>
  );
}

export function CalendarDemo({ setDateOption, dateRef, setDate }) {
  useEffect(() => {
    if (dateRef) {
      const localDate =
        dateRef.getFullYear() +
        '-' +
        String(dateRef.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(dateRef.getDate()).padStart(2, '0');

      setDateOption('custom: ' + localDate);
    }
  }, [dateRef]);

  return (
    <Calendar
      mode="single"
      selected={dateRef}
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
      <div className="flex gap-16 md:gap-32 items-end mb-4 ">
        <h1 className="text-2xl md:text-3xl  font-semibold pb-4">Distance</h1>
        <span className="pb-5 md:pb-1">{distance} km</span>
      </div>

      <Slider
        value={[distance]} // <-- array necesario
        min={0}
        max={100}
        step={1}
        onValueChange={(val) => setDistance(val[0])} // <-- devolver número
        className={cn('w-[60%] ml-8 ', className)}
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
    'All styles',
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
    <div>
      <div className="grid grid-flow-col grid-rows-2 auto-cols-max gap-2 mt-4 border border-black/20 p-2 rounded  overflow-x-auto">
        {all_styles.map((style) => {
          const isSelected = styles.includes(style);
          return (
            <div
              key={style}
              className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-500 text-text-secondary'
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

      {styles.length > 0 && (
        <div className="p-4">
          <span>Selected styles: </span>
          <span>{styles[0]}</span>
          {styles.slice(1).map((s) => (
            <span key={s}>, {s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
