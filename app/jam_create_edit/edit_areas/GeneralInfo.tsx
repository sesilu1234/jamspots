'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Primary from '../../google_createJam/primary';
import { GeneralInfoProps } from './types/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Weekday } from 'react-day-picker';

export default function EditArea({
  dataRef,
  childSaveOnUnmount,
}: GeneralInfoProps) {
  const [period, setPeriod] = useState<'manual' | 'weekly' | undefined>(
    dataRef.current.dates.period,
  );
  const [weekDay, setWeekDay] = useState<string | undefined>(
    dataRef.current.dates.day_of_week,
  );
  const [dates, setDates] = React.useState<Date[]>(
    dataRef.current.dates.list_of_dates,
  );

  const [fromTime, setFromTime] = useState(dataRef.current.dates.time.from);
  const [toTime, setToTime] = useState(dataRef.current.dates.time.to);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const jamTitleRef = useRef(dataRef.current.jam_title);
  const locationTitleRef = useRef(dataRef.current.location_title);
  const locationAdressRef = useRef(dataRef.current.location_adress);
  const coordinatesRef = useRef(dataRef.current.coordinates);
  const datesRef = useRef(dataRef.current.dates);

  datesRef.current = {
    period: period,
    day_of_week: weekDay,
    time: { from: fromTime, to: toTime },
    list_of_dates: dates,
  };

  // {
  //     jam_title: '',
  //     location_title: '',
  //     location_adress: '',
  //     coordinates: {
  //       lat: '',
  //       lng: '',
  //     },
  //     dates: {
  //       period: null,
  //       time: { from: '21:30', to: null },
  //       list_of_dates: [],
  //     },
  //   }

  function updateDataRef() {
    dataRef.current = {
      jam_title: jamTitleRef.current,
      location_title: locationTitleRef.current,
      location_adress: locationAdressRef.current,
      coordinates: coordinatesRef.current,
      dates: datesRef.current,
    };
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    childSaveOnUnmount.current = updateDataRef;

    return () => {
      childSaveOnUnmount.current = () => {};
    };
  }, []);

  return (
    <div className="p-15">
      <div className="mx-auto w-3/4">
        <Primary
          jamTitleRef={jamTitleRef}
          locationTitleRef={locationTitleRef}
          locationAdressRef={locationAdressRef}
          coordinatesRef={coordinatesRef}
        />
      </div>

      <div className="mx-auto w-3/4 p-4 ">
        <h3 className="font-bold text-2xl mb-4">Horario</h3>
        <div className="flex gap-8 items-end">
          <div className="flex gap-4">
            <Select
              defaultValue={period}
              onValueChange={(value) => setPeriod(value as 'manual' | 'weekly')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Period</SelectLabel>
                  <SelectItem value="manual">
                    Select manually on calendar
                  </SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Second select */}
            {period === 'weekly' ? (
              <Select defaultValue={weekDay} onValueChange={setWeekDay}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select day of week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Day</SelectLabel>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Select disabled>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="N/A" />
                </SelectTrigger>
              </Select>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-from" className="px-1">
                From
              </Label>
              <Input
                type="time"
                id="time-from"
                step="60" // optional
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="time-to" className="px-1">
                To
              </Label>
              <Input
                type="time"
                id="time-to"
                step="60" // optional
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between py-6 mt-6">
          <h1 className="">
            Or select manually (dates keep the time inputed):
          </h1>
          <button
            className="p-2 bg-amber-300 rounded-lg"
            onClick={() => setDates([])}
          >
            Clear dates
          </button>
        </div>

        <Calendar03
          period={period}
          weekDay={weekDay}
          dates={dates}
          datesSetter={setDates}
        />
        <div className="mt-4">
          <h2>Selected dates:</h2>
          <div className="mt-4 flex gap-2 items-center">
            {dates.slice(0, 3).map((date, i) => (
              <span key={i} className="px-2 py-1 bg-gray-200 rounded">
                {date.toLocaleDateString()} {fromTime}{' '}
                {/* use state directly */}
              </span>
            ))}
            {dates.length > 3 && <span className="px-2 py-1">...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Calendar03Props {
  period?: 'manual' | 'weekly' | null;
  weekDay?: string;
  dates?: Date[];
  datesSetter?: (dates: Date[]) => void;
}

export function Calendar03({
  period,
  weekDay,
  dates,
  datesSetter = () => {},
}: Calendar03Props) {
  useEffect(() => {
    if (period === 'weekly' && weekDay) {
      const dayIndex = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ].indexOf(weekDay);
      if (dayIndex === -1) return;

      const today = new Date();
      const newDates: Date[] = [];

      // fill next 3 months with that weekday
      for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
        const year = today.getFullYear();
        const month = today.getMonth() + monthOffset;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        for (let d = firstDay.getDate(); d <= lastDay.getDate(); d++) {
          const date = new Date(year, month, d);
          if (date.getDay() === dayIndex) newDates.push(date);
        }
      }

      datesSetter(newDates);
    }
  }, [period, weekDay]);

  return (
    <Calendar
      mode="multiple"
      numberOfMonths={2}
      required
      selected={dates}
      onSelect={datesSetter}
      className="rounded-lg border shadow-sm mt-0 mx-auto"
    />
  );
}
