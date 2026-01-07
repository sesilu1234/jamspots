import { z } from "zod";

/* ---------- constants ---------- */

const daysOfWeek = [
  "Monday","Tuesday","Wednesday","Thursday",
  "Friday","Saturday","Sunday",
] as const;

const styles = [
  "Blues","Rock","All styles","Country","Jazz","Pop","Funk","Soul",
  "Reggae","Metal","Hip-Hop","R&B","Disco","House","Trance",
  "Electronic","Acoustic","Singer-Songwriter","Folk","Indie",
  "Alternative","Roots","Afro","Fusion","Latin",
  "Improvisation","Open Mic",
] as const;

/* ---------- helpers ---------- */

const dateString = z.string().refine(
  (v) => !Number.isNaN(Date.parse(v)),
  { message: "Invalid date format" }
);

const optionalUrl = z.url({ message: "Invalid URL" }).max(150).optional();

/* ---------- schema ---------- */

export const jamSchema = z.object({
  jam_title: z.string()
              .min(1, { message: "Jam name cannot be empty" })
              .max(50, { message: "Jam name too long" }),

  location_title: z.string()
                   .min(1, { message: "Location name cannot be empty" })
                   .max(50, { message: "Location name too long" }),

  location_address: z.string()
                     .min(1, { message: "Address cannot be empty" })
                     .max(150, { message: "Address too long" }),

  periodicity: z.enum(["manual", "weekly"])
  .refine((val) => val !== undefined && val !== null, {
    message: "Choose periodicity",
  })
,

  dayOfWeek: z.enum(daysOfWeek).nullable().optional(),

   dates: z.array(z.string()).optional(), // can be empty

  images: z.array(z.url({ message: "Invalid image URL" }))
           .min(2, { message: "At least 2 images required" })
           .max(4, { message: "Max 4 images allowed" }),

  styles: z.array(z.enum(styles))
           .min(1, { message: "Select at least one style" })
           .max(3, { message: "Max 3 styles allowed" }),

  lista_canciones: z.boolean().default(false),
  instruments_lend: z.boolean().default(false),
  drums: z.boolean().default(false),

  description: z.string()
  .min(20, { message: "Description too short, add at least 20 characters" })
  .max(1400, { message: "Description too long" })
  .optional(),


social_links: z.object({
  facebook: z.string().max(150).optional(),
  instagram: z.string().max(150).optional(),
  web: z.string().max(150).optional(),
}).optional(),

  location_coords: z.object({
    lat: z.number().refine((v) => typeof v === "number", { message: "Latitude must be a number" })
          .min(-90, { message: "Latitude must be >= -90" })
          .max(90, { message: "Latitude must be <= 90" }),
    lng: z.number().refine((v) => typeof v === "number", { message: "Longitude must be a number" })
          .min(-180, { message: "Longitude must be >= -180" })
          .max(180, { message: "Longitude must be <= 180" }),
  }),
})
.superRefine((data, ctx) => {
  if (data.periodicity === "weekly" && !data.dayOfWeek) {
    ctx.addIssue({
      path: ["dayOfWeek"],
      message: "You must pick a day for weekly jams",
      code: "custom",
    });
  }

  if (data.periodicity === "manual" && !data.dates?.length) {
    ctx.addIssue({
      path: ["dates"],
      message: "Dates required for manual jams",
      code: "custom",
    });
  }
});
