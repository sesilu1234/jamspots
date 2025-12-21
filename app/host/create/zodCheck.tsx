import { z } from 'zod';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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

export const jamSchema = z.object({
  jam_title: z.string().min(1).max(50),
  location_title: z.string().min(1).max(50),
  location_address: z.string().min(1).max(150),

  periodicity: z.enum(['manual', 'weekly']),

  dayOfWeek: z.enum(daysOfWeek).nullable().optional(), // DB allows null

  // array of timestamps (strings that parse as dates)
  dates: z
    .array(
      z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: 'Invalid date',
      }),
    )
    .optional()
    .nullable(),

  // images: 2–4 items
  images: z.array(z.string()).min(2).max(4),

  // styles: 1–3 items
  styles: z.array(z.enum(all_styles)).min(1).max(3),

  lista_canciones: z.boolean().default(false),
  instruments_lend: z.boolean().default(false),
  drums: z.boolean().default(false),

  // JSON fields
  description: z.any().nullable().optional(),
  social_links: z.object({
    facebook: z.string().max(150).optional(),
    instagram: z.string().max(150).optional(),
    web: z.string().max(150).optional(),
  }), // adapt to your structure

  // PostGIS geography POINT(4326)
  location_coords: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});
