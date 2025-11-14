import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  classname,
}) {
  return (
    <Card className={`flex flex-col p-2    w-64  shadow-md   ${classname}`}>
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
      <CardContent className="flex flex-col justify-between text-xs ">
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
    </Card>
  );
}

export function CardDemo_1() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-xs">Login to your account</CardTitle>
        <CardDescription className="text-xs">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
