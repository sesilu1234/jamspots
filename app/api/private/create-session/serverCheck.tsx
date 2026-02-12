const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const stylesList = [
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
  'Improvisation',
] as const;

type DayOfWeek = (typeof daysOfWeek)[number];
type Style = (typeof stylesList)[number];

interface JamInput {
  jam_title: string;
  location_title: string;
  location_address: string;
  periodicity: 'manual' | 'weekly';
  dayOfWeek?: DayOfWeek;
  dates: string[];
  images_three: boolean;
  modality: 'jam' | 'open_mic';
  styles: Style[];
  lista_canciones: boolean;
  instruments_lend: boolean;
  drums: boolean;
  time_start: string;
  raw_desc: string;
  description: unknown;
  social_links?: {
    facebook?: string;
    instagram?: string;
    web?: string;
  };
  location_coords: {
    lat: number;
    lng: number;
  };
}

type ValidationErrors = Partial<Record<keyof JamInput | string, string>>;

export function validateJam(input: JamInput) {
  const errors: ValidationErrors = {};

  // jam_title
  if (!input.jam_title?.trim()) errors.jam_title = 'Jam name cannot be empty';
  else if (input.jam_title.length > 50) errors.jam_title = 'Jam name too long';

  // location_title
  if (!input.location_title?.trim())
    errors.location_title = 'Location name cannot be empty';
  else if (input.location_title.length > 50)
    errors.location_title = 'Location name too long';

  // location_address
  if (!input.location_address?.trim())
    errors.location_address = 'Address cannot be empty';
  else if (input.location_address.length > 150)
    errors.location_address = 'Address too long';

  // periodicity
  if (input.periodicity !== 'manual' && input.periodicity !== 'weekly')
    errors.periodicity = 'Choose periodicity';

  // dayOfWeek
  if (
    input.periodicity === 'weekly' &&
    (!input.dayOfWeek || !daysOfWeek.includes(input.dayOfWeek))
  )
    errors.dayOfWeek = 'You must pick a day for weekly jams';

  // dates
  if (input.periodicity === 'manual' && input.dates.length > 1000)
    errors.dates = 'Select up to 1000 dates';

  if (!input.images_three) errors.images_three = 'Exactly 3 images required';

  // modality (already typed, just ensure exists)
  if (!input.modality) errors.modality = 'Modality is required';

  // styles
  if (!Array.isArray(input.styles) || input.styles.length < 1)
    errors.styles = 'Select at least one style';
  else if (input.styles.length > 3) errors.styles = 'Max 3 styles allowed';
  else if (!input.styles.every((s) => stylesList.includes(s)))
    errors.styles = 'Invalid style selected';

  // boolean fields
  (['lista_canciones', 'instruments_lend', 'drums'] as const).forEach(
    (field) => {
      if (typeof input[field] !== 'boolean')
        errors[field] = 'Must be true or false';
    },
  );

  // time_start (HH:MM)
  if (typeof input.time_start !== 'string') {
    errors.time_start = 'Invalid time format (expected HH:MM)';
  } else {
    const [h, m] = input.time_start.split(':').map(Number);
    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      h < 0 ||
      h > 23 ||
      m < 0 ||
      m > 59
    ) {
      errors.time_start = 'Invalid time format (expected HH:MM)';
    }
  }

  // description length (using raw_desc)
  const descriptionText = input.raw_desc ?? '';

  if (descriptionText.length < 20)
    errors.description = 'Description too short (min 20 chars)';
  else if (descriptionText.length > 1400)
    errors.description = 'Description too long';

  // social_links
  if (input.social_links) {
    (['facebook', 'instagram', 'web'] as const).forEach((k) => {
      const value = input.social_links?.[k];
      if (value && value.length > 150)
        errors.social_links = 'Max 150 characters per link';
    });
  }

  // location_coords
  if (!input.location_coords) {
    errors.location_coords = 'Coordinates required';
  } else {
    const { lat, lng } = input.location_coords;
    if (typeof lat !== 'number' || typeof lng !== 'number')
      errors.location_coords = 'Coordinates must be numbers';
    else if (lat < -90 || lat > 90 || lng < -180 || lng > 180)
      errors.location_coords = 'Coordinates out of range';
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}
