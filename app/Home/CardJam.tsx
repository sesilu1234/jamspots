import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Image from 'next/image';

export default function JamCard({
  jamName,
  spotName,
  address,
  time,
  tags,
  src,
  slug,
  classname,
}) {
  return (
    <Card
      className={`flex flex-col p-4    w-64  shadow-md  bg-tone-5
 ${classname}`}
    >
      <Link href={`/jam/${slug}`} prefetch={false}>
        {/* Image left (desktop) / top (mobile) */}
        <div className="relative   h-48">
          {src && (
            <Image
              src={src}
              alt={`${jamName} at ${spotName}`}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Right panel */}
        <CardContent className="flex flex-col gap-1 justify-between text-xs pt-3 pb-2 ">
          <div
            className="font-medium text-lg text-white mb-2 line-clamp-2 overflow-hidden text-ellipsis"
            title={`${jamName} at ${spotName}`}
          >
            {jamName} at {spotName}
          </div>

          <div className="text-xs text-white/70 truncate">{address}</div>

          <div className="text-sm text-white/90">{'Tuesday 9, 20:15'}</div>
          {tags && (
            <div className="flex flex-wrap gap-1 mt-3 text-black">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className=" border-1 border-white text-white/95 rounded px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
