import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';

import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type AvatarCustomProps = {
  session: Session | null;
};

import Image from 'next/image';

function AvatarCustom({ session }: AvatarCustomProps) {
  const img = session?.user?.image;

  return img ? (
    <Image
      src={img}
      alt="User avatar"
      width={62}
      height={62}
      className="rounded-full object-cover border border-white/40 k"

    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white">
      <User />
    </div>
  );
}

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DropdownMenuAvatar({ session }: AvatarCustomProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button>
            <AvatarCustom session={session} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 relative top-0" align="end">
          <DropdownMenuLabel>Your account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/host">Acceder</Link>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })}>
              Cerrar sesión
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              <div className="h-[1.5px] bg-gray-700/50 w-full "></div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuGroup>
            <div className="px-0 py-0">
              <AccordionTheme />
            </div>
            <div className="px-0 py-0">
              <AccordionLanguage />
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>
              Anyone with the link will be able to view this file.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-3">
            <Field>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="shadcn@vercel.com"
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
              <Textarea
                id="message"
                name="message"
                placeholder="Check out this file"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { Sun, Moon, Coffee, Droplet, Leaf } from 'lucide-react';

export function AccordionTheme() {
  const [theme, setTheme] = useState<
    'light' | 'dark' | 'tangerine' | 'ocean' | 'forest'
  >('light');

  const themes = ['light', 'dark', 'tangerine', 'ocean', 'forest'];
  const icons = [Sun, Moon, Coffee, Droplet, Leaf];
  const iconColors: Record<string, string> = {
    light: 'text-yellow-400',
    dark: 'text-purple-400',
    tangerine: 'text-orange-500',
    ocean: 'text-blue-400',
    forest: 'text-green-500',
  };

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={undefined}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Theme Mode</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 py-2">
          {themes.map((t, i) => {
            const Icon = icons[i];
            return (
              <button
                key={t}
                className={`flex items-center gap-2 px-4 py-1 text-left ${
                  theme === t
                    ? 'font-bold'
                    : 'hover:bg-accent hover:underline rounded-md'
                }`}
                onClick={() => setTheme(t as typeof theme)}
              >
                <Icon className={`w-4 h-4 ${theme === t ? iconColors[t] : 'text-slate-400'}`} />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
export function AccordionLanguage() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={undefined}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Language</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 py-2">
          <button
            className={`px-4 py-1 text-left ${language === 'en' ? 'font-bold' : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button
            className={`px-4 py-1 text-left ${language === 'es' ? 'font-bold' : ''}`}
            onClick={() => setLanguage('es')}
          >
            Spanish
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
