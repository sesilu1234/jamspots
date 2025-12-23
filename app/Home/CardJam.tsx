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
    <Card className={`flex flex-col p-2    w-64  shadow-md   ${classname}`}>
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
        <CardContent className="flex flex-col justify-between text-xs pt-3 pb-2 ">
          <div className="font-bold text-lg">
            {jamName} at {spotName}
          </div>

          <div className="text-xs text-gray-500">{address}</div>
          <div className="text-sm text-gray-500">{time}</div>
          {tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, i) => (
                <span key={i} className="bg-gray-200 rounded px-2 py-1 text-xs">
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
