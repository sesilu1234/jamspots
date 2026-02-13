import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "lucide-react";

import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

type AvatarCustomProps = {
	session: Session | null;
};

function AvatarCustom({ session }: AvatarCustomProps) {
	return (
		<div className="w-16 h-16 flex items-center justify-center">
			<Avatar className="w-16 h-16">
				<AvatarImage
					src={session?.user?.image ?? ""}
					alt="User avatar"
					className="rounded-full object-cover"
				/>
				<AvatarFallback className="bg-black/90 text-white">
					<User className="w-6 h-6" />
				</AvatarFallback>
			</Avatar>
		</div>
	);
}

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DropdownMenuNotSignedIn() {
	const [showNewDialog, setShowNewDialog] = useState(false);
	const [showShareDialog, setShowShareDialog] = useState(false);


	const sendData = (email: string, msg: string) => {
  fetch('/api/public/users-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, msg }),
  });
};

const [email, setEmail] = useState('');
const [message, setMessage] = useState('');

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page reload
    
    console.log(email, message);
    sendData(email, message);
	setShowShareDialog(false);
    
    // Optional: setShowShareDialog(false);
};

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<button>
						<div
							className="shadow-md hover:shadow-lg   hover:bg-tone-4
                         transition-all duration-200 cursor-pointer px-2 py-1 rounded-sm border-2 border-tone-1"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						</div>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-40 relative top-5 z-[500]"
					align="end"
				>
					<DropdownMenuLabel>Create a Jam</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href="/signIn">Sign In</Link>
						</DropdownMenuItem>

						<DropdownMenuItem disabled>
							<div className="h-[1.5px] bg-tone-0/40 w-full "></div>
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
						<DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
							Contact
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px] z-[1000] text-black">
            {/* Wrap contents in a form */}
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Contact the Developer</DialogTitle>
                    <DialogDescription>
                        Send a message if you have questions or feedback about this website.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup className="py-3">
                    <Field>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="shadcn@vercel.com"
                            autoComplete="off"
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Any questions or feedback"
                            required
                        />
                    </Field>
                </FieldGroup>

                <DialogFooter className="gap-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="border-2 border-black hover:opacity-60 hover:text-black">
                            Cancel
                        </Button>
                    </DialogClose>
                    {/* This button triggers the form's onSubmit */}
                    <Button type="submit" className="border-2 border-red">
                        Send
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
		</>
	);
}

import { Sun, Moon, Coffee, Droplet, Leaf, Rocket } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function AccordionTheme() {
	const { theme, setTheme } = useTheme(); // use context

	const themes = ["light", "dark", "tangerine", "ocean", "forest"] as const;

	const icons = [Sun, Moon, Coffee, Droplet, Leaf, Rocket];

	const iconColors: Record<typeof themes[number], string> = {
		light: "text-yellow-400",
		dark: "text-purple-400",
		tangerine: "text-orange-400",
		ocean: "text-blue-400",
		forest: "text-green-500",
	};

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="theme">
				<AccordionTrigger>Theme Mode</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-2 py-2">
					{themes.map((t, i) => {
						const Icon = icons[i];
						return (
							<button
								key={t}
								onClick={() => setTheme(t)}
								className={`flex items-center gap-2 px-4 py-1 text-left rounded-md ${
									theme === t ? "font-bold" : "hover:bg-accent hover:underline"
								}`}
							>
								<Icon
									className={`w-4 h-4 ${
										theme === t ? iconColors[t] : "text-gray-400/80"
									}`}
								/>
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
	const [language, setLanguage] = useState<"en" | "es">("en");

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
						className={`px-4 py-1 text-left ${
							language === "en" ? "font-bold" : ""
						}`}
						onClick={() => setLanguage("en")}
					>
						English
					</button>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
