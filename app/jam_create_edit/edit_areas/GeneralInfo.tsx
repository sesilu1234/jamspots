'use client';
import { useState } from 'react';
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

export default function EditArea({ dataRef, childSaveOnUnmount }: GeneralInfoProps) {
  return (
    <div className="p-15">
      <div className="flex justify-center m-12 ml-auto p-2 bg-black text-white w-32 rounded-lg">
        Save and Exit
      </div>

      <div className="mx-auto w-3/4">
        <Primary />
      </div>

      <div className="mx-auto w-3/4 p-4 ">
        <h3 className="font-bold text-2xl mb-4">Horario</h3>
        <div className="flex gap-8 items-end">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period</SelectLabel>
                <SelectItem value="manual">
                  Select manually on calendar
                </SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1">
              From
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="60" // or just remove this line
              defaultValue="10:30"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1">
              To
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="60" // or just remove this line
              defaultValue="10:30"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
        <div className="flex justify-between py-6 mt-6">
          <h1 className="">Or select manually:</h1>
          <button className="p-2 bg-amber-300 rounded-lg">Delete dates</button>
        </div>
        <Calendar03 />
      </div>
    </div>
  );
}

export function Calendar03() {
  const [dates, setDates] = React.useState<Date[]>([
    new Date(2025, 5, 12),
    new Date(2025, 6, 24),
  ]);

  return (
    <Calendar
      mode="multiple"
      numberOfMonths={2}
      defaultMonth={dates[0]}
      required
      selected={dates}
      onSelect={setDates}
      max={5}
      className="rounded-lg border shadow-sm mt-0 mx-auto"
    />
  );
}
