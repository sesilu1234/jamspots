import Image from 'next/image';
import React from 'react';

type JamImagesProps = {
  images: string[];
};

export function JamImagesTop({ images }: { images: string[] }) {
  if (!images[0]) return null;

  return (
    <div className="relative group w-full aspect-4/3 lg:aspect-square max-h-125 flex items-center justify-center">
      {/* Background Blur Layer - Tightened up */}
      <div className="absolute inset-4 overflow-hidden rounded-3xl opacity-30">
        <Image
          src={images[0]}
          alt=""
          fill
          className="object-cover blur-md scale-100" // Reduced blur and removed overflow scale
        />
      </div>

      {/* Sharp Main Image "Floating" */}
      <div className="relative z-10 w-[94%] h-[94%] transition-all duration-500 ease-out scale-95 group-hover:scale-98 ">
        <Image
          src={images[0]}
          alt="Jam Preview"
          fill
          className="object-cover rounded-xl shadow-xl border border-tone-0/10 object-top"
        />

        {/* Lighter Gradient Overlay - cleaner look */}
        <div className="absolute inset-0 rounded-xl bg-linear-to-t from-tone-6/30 via-transparent to-transparent opacity-40" />
      </div>
    </div>
  );
}

export function JamImagesBottom({ images }: JamImagesProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 lg:gap-6 w-full">
      {/* Photo 1: col-span-2 row-span-2 */}
      <div
        className="col-span-2 row-span-2 relative w-4/4 aspect-4/3 lg:aspect-video rounded-xl overflow-hidden
          ring-0 ring-neutral-400/20 shadow-[0_12px_24px_rgba(255,255,255,0.1)]"
      >
        {images[0] && (
          <Image
            src={images[0]}
            alt="Photo 1"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
        )}
      </div>

      {/* Photo 2: col-span-2 row-span-2 */}
      <div
        className="col-span-2 row-span-2 relative  w-4/4 aspect-4/3 lg:aspect-video  rounded-xl overflow-hidden
          ring-0 ring-neutral-400/20 shadow-[0_12px_24px_rgba(255,255,255,0.1)]"
      >
        {images[1] && (
          <Image
            src={images[1]}
            alt="Photo 1"
            fill
            className="object-cover"
            sizes="50vw"
          />
        )}
      </div>

      {/* Photo 3: col-3 row-2 */}
      {/* Add more photos here using the same pattern */}
    </div>
  );
}
// export default function JamImages({ images }: JamImagesProps) {
//   return (
//     <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-[200px] mt-8">
//       {/* Photo 1: col-span-2 row-span-2 */}
//       <div className="col-span-2 row-span-2 relative w-full h-full bg-gray-350 ">
//         {images[0] && (
//           <Image
//             src={images[0]}
//             alt="Photo 1"
//             layout="fill"
//             objectFit="cover"
//             className="rounded-xl"
//           />
//         )}
//       </div>

//       {/* Photo 2: col-span-2 row-1 */}
//       <div className="col-span-2 row-span-1 relative w-full h-full bg-gray-350">
//         {images[1] && (
//           <Image
//             src={images[1]}
//             alt="Photo 2"
//             layout="fill"
//             objectFit="cover"
//             className="rounded-xl"
//           />
//         )}
//       </div>

//       {/* Photo 3: col-3 row-2 */}
//       <div className="col-start-3 row-start-2 relative w-full h-full bg-gray-350">
//         {images[2] && (
//           <Image
//             src={images[2]}
//             alt="Photo 3"
//             layout="fill"
//             objectFit="cover"
//           />
//         )}
//       </div>

//       {/* Photo 4: col-4 row-2 */}
//       <div className="col-start-4 row-start-2 relative w-full h-full bg-gray-350">
//         {images[3] && (
//           <Image
//             src={images[3]}
//             alt="Photo 4"
//             layout="fill"
//             objectFit="cover"
//           />
//         )}
//       </div>
//     </div>
//   );
// }
