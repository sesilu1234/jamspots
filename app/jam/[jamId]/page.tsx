import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface JamPageProps {
  params: { jamId: string };
}

export default async function JamPage({ params }: JamPageProps) {
  const { jamId } = await params;

  return (
    <div className="min-h-screen bg-gray-300 ">
      <div className="flex justify-between w-[1300px] max-w-[90%] mx-auto py-12">
        <div className="ml-3 flex gap-2 items-end">
          <img src="/jamspots_icon.png" alt="Jamspots icon" className="h-16" />
          <p className="relative bottom-0 text-xs py-3 text-gray-600 font-semibold">
            Find the next spot to share your sound.
          </p>
        </div>

        <div className="w-16 h-16 ">
          <Avatar className="">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="w-[1300px] max-w-[60%] mx-auto flex flex-col">
        <h3 className="text-5xl font-bold">La Otra Jam, at Moe Club</h3>

        <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-[300px] mt-12">
          {/* Photo 1: col-span-2 row-span-2 */}
          <div className="col-span-2 row-span-2 bg-red-400">
            <img
              src="/images_Jam/moe0.jpg"
              alt="Photo 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo 2: col-span-2 row-1 */}
          <div className="col-span-2 row-span-1 bg-blue-400">
            <img
              src="/images_Jam/moe1.jpg"
              alt="Photo 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo 3: col-3 row-2 */}
          <div className="col-start-3 row-start-2 bg-green-400">
            <img
              src="/images_Jam/moe3.jpg"
              alt="Photo 3"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo 4: col-4 row-2 */}
          <div className="col-start-4 row-start-2 bg-yellow-400">
            <img
              src="/images_Jam/moe4.jpg"
              alt="Photo 4"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-[1300px] max-w-[75%] mx-auto py-12 ">
        <div className="bg-[rgb(170_170_170/0.7)] rounded-xl ">
          <div className="flex p-6 ">
            <div className=" gap-8 flex flex-col items-center">
              <h1 className="text-2xl font-semibold">¿Cómo es esta Jam?</h1>

              <div className="flex items-center gap-2">
                <h2 className="font-medium">Estilos:</h2>
                <div className="flex gap-3">
                  <div>Blues</div>
                  <div>Improvisación</div>
                  <div>Funk</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div>Acústico</div>
                <div>Lista opcional</div>
                <div>Sí hay instrumentos</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[rgb(170_170_170/0.7)] rounded-xl "></div>
      </div>
    </div>
  );
}
