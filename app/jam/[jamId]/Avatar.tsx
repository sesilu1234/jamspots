type AvatarProps = {
  display_name: string;

  size?: string;  // optional tailwind size, default w-10 h-10
};

const adjectiveColorMap: Record<string, string> = {
  Cosmic: 'bg-purple-600',
  Shiny: 'bg-yellow-300',
  Swift: 'bg-sky-500',
  Chill: 'bg-blue-300',
  Bold: 'bg-red-500',
  Mighty: 'bg-orange-600',
  Electric: 'bg-yellow-400',
  Silver: 'bg-gray-400',
  Golden: 'bg-yellow-500',
  Hidden: 'bg-slate-500',
  Silent: 'bg-gray-500',
  Neon: 'bg-lime-400',
  Dapper: 'bg-rose-400',
  Wild: 'bg-green-600',
  Calm: 'bg-blue-400',
  Brave: 'bg-red-400',
  Jolly: 'bg-pink-400',
  Lunar: 'bg-indigo-500',
  Solar: 'bg-orange-500',
  Frosty: 'bg-cyan-400',
  Spicy: 'bg-red-600',
  Crisp: 'bg-emerald-400',
  Loyal: 'bg-blue-600',
  Clever: 'bg-violet-500',
  Zesty: 'bg-orange-400',
  Grand: 'bg-amber-600',
  Keen: 'bg-teal-500',
  Amber: 'bg-amber-500',
  Zen: 'bg-stone-400',
  Vivid: 'bg-fuchsia-500',
};



const animalImageMap: Record<string, string> = {
  Panda: '/user_icons/sloth.webp',
  Fox: '/user_icons/fox.webp',
  Falcon: '/user_icons/fox.webp',
  Otter: '/user_icons/fox.webp',
  Tiger: '/user_icons/tiger.webp',
  Badger: '/user_icons/fox.webp',
  Rhino: '/user_icons/fox.webp',
  Koala: '/user_icons/fox.webp',
  Shark: '/user_icons/shark.webp',
  Gecko: '/user_icons/tiger.webp',
  Bison: '/user_icons/tiger.webp',
  Eagle: '/user_icons/owl.webp',
  Wolf: '/user_icons/tiger.webp',
  Lynx: '/user_icons/owl.webp',
  Owl: '/user_icons/owl.webp',
  Puffin: '/user_icons/tiger.webp',
  Lemur: '/user_icons/owl.webp',
  Moose: '/user_icons/owl.webp',
  Seal: '/user_icons/fox.webp',
  Newt: '/user_icons/tiger.webp',
  Heron: '/user_icons/owl.webp',
  Sloth: '/user_icons/sloth.webp',
  Mamba: '/user_icons/tiger.webp',
  Crane: '/user_icons/owl.webp',
  Raven: '/user_icons/tiger.webp',
  Orca: '/user_icons/owl.webp',
  Puma: '/user_icons/tiger.webp',
  Dolphin: '/user_icons/owl.webp',
  Beaver: '/user_icons/beaver.webp',
  Stag: '/user_icons/beaver.webp',
};


const getColorForUsername = (username: string) => {
  for (const adj in adjectiveColorMap) {
    if (username.includes(adj)) return adjectiveColorMap[adj];
  }
  return 'bg-gray-400';
};



const getAnimalImage = (username: string) => {
  for (const animal in animalImageMap) {
    if (username.includes(animal)) return animalImageMap[animal];
  }
  return '/user_icons/tiger.webp';
};





export function Avatar({ display_name, size = 'w-10 h-10' }: AvatarProps) {
  const bgColor = getColorForUsername(display_name);
  const avatar = getAnimalImage(display_name);

  return (
    <div className={`${size} ${bgColor} rounded-full p-0.5 flex items-center justify-center`}>
      <img
        src={avatar}
        alt={display_name}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
}

export function AvatarSelf({ display_name, size = 'w-10 h-10' }: AvatarProps) {
  const bgColor = getColorForUsername(display_name);
  const avatar = getAnimalImage(display_name);

  return (
    <div
      className={`${size} ${bgColor} rounded-full p-0.5 flex items-center justify-center
        shadow-[0_0_18px_rgba(59,130,246,0.9)]    
        animate-[pulse_4s_cubic-bezier(0.4,0,0.2,1)_infinite]
        brightness-110`}
    >
      <img
        src={avatar}
        alt={display_name}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
}
