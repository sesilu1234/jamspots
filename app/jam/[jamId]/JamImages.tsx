import Image from "next/image";
import React from "react";

type JamImagesProps = {
  images: string[];
};

export default function JamImages({ images }: JamImagesProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-[300px] mt-12">
      {/* Photo 1: col-span-2 row-span-2 */}
      <div className="col-span-2 row-span-2 relative w-full h-full bg-gray-350">
        {images[0] && (
          <Image src={images[0]} alt="Photo 1" layout="fill" objectFit="cover" />
        )}
      </div>

      {/* Photo 2: col-span-2 row-1 */}
      <div className="col-span-2 row-span-1 relative w-full h-full bg-gray-350">
        {images[1] && (
          <Image src={images[1]} alt="Photo 2" layout="fill" objectFit="cover" />
        )}
      </div>

      {/* Photo 3: col-3 row-2 */}
      <div className="col-start-3 row-start-2 relative w-full h-full bg-gray-350">
        {images[2] && (
          <Image src={images[2]} alt="Photo 3" layout="fill" objectFit="cover" />
        )}
      </div>

      {/* Photo 4: col-4 row-2 */}
      <div className="col-start-4 row-start-2 relative w-full h-full bg-gray-350">
        {images[3] && (
          <Image src={images[3]} alt="Photo 4" layout="fill" objectFit="cover" />
        )}
      </div>
    </div>
  );
}
