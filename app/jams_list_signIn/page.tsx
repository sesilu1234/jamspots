import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import Image from 'next/image';

type JamProps = {
  jam_name: string;
  jam_address: string;
  jam_image_src: string;
};

const list_of_jams = [
  {
    jam_name: 'La Otra Jam, at Moe Club',
    jam_address:
      'Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid, Spain',
    jam_image_src: '/images_Jam/moe3.jpg',
  },

  {
    jam_name: 'Fosforito Blues Jam',
    jam_address: 'C. del Pez, 2, Centro, 28004 Madrid, Spain',
    jam_image_src: '/images_Jam/moe1.jpg',
  },

  {
    jam_name: 'Rockville Open Jam',
    jam_address: 'Av. de Brasil, 3, Tetuán, 28020 Madrid, Spain',
    jam_image_src: '/images_Jam/moe0.jpg',
  },

  {
    jam_name: 'Marula Soul & Funk Jam',
    jam_address: 'C. del Caños Viejos, 3, Centro, 28005 Madrid, Spain',
    jam_image_src: '/images_Jam/moe4.jpg',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-300">
      <div className="w-[1300px] max-w-[90%] mx-auto pt-12 pb-128">
        <div className="flex justify-between  p">
          <div className="relative ml-3 flex  items-center gap-2">
            <h3 className="font-bold text-4xl">jamspots</h3>
            <p className="text-xs pt-5 text-gray-800 font-semibold">
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
        <div className="flex flex-col gap-8 mt-16 ml-48">
          <div className="flex gap-4 items-center font-semibold ">
            <svg
              width="16"
              height="16"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.40527 12.65H23V10.35H4.40527L13.1395 1.61575L11.5 0L0 11.5L11.5 23L13.1395 21.3842L4.40527 12.65Z"
                fill="#1F1F1F"
              />
            </svg>
            <h1 className="text-sm">Back to home page</h1>
          </div>
          <h3 className="font-bold text-3xl">Your jams</h3>
        </div>

        <div className="flex flex-col mt-24 gap-6">
          {list_of_jams.map((jam, i) => (
            <Jam
              key={i}
              jam_name={jam.jam_name}
              jam_address={jam.jam_address}
              jam_image_src={jam.jam_image_src}
            />
          ))}
        </div>
        <div className=" mt-10 mx-auto  w-3xl">
          <div className="flex  justify-center items-center h-32 w-[calc((100%-4rem)*3/8)]  bg-gray-500 rounded-lg">
            <div className="flex items-center justify-between font-semibold text-white gap-2">
              <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="white"
                >
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </svg>
              </div>
              <span>Add a new jam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Jam({ jam_name, jam_address, jam_image_src }: JamProps) {
  return (
    <div className="flex items-center gap-8 py-4 mx-auto w-3xl">
      <div className="w-3/8 h-32 relative">
        <Image
          src={jam_image_src}
          alt={jam_name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col w-3/8">
        <h3 className="text-lg font-bold">{jam_name}</h3>
        <h1 className="text-sm text-gray-600 font-semibold">{jam_address}</h1>
      </div>

      <div className="flex gap-4 w-2/8 ">
        <button className="px-3 py-1 rounded-sm bg-black/80 text-white">
          Editar
        </button>
        <button className="px-3 py-1 rounded-sm bg-red-600/80 text-white">
          Eliminar
        </button>
      </div>
    </div>
  );
}
