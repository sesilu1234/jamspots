"use client";

import React, { useRef } from "react";
import EditSections_desktop from "./EditSections_desktop";
import EditSections_phone from "./EditSections_phone";
import EditArea from "./EditArea";
import { useRouter } from "next/navigation";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
	const childSaveOnUnmount = useRef<() => void>(() => {});
	const router = useRouter();

	return (
		<div className="relative flex flex-col lg:flex-row bg-background text-primary">
			<div className=" lg:min-h-screen  bg-[rgb(30,30,30)] ">
				<Dialog>
					<DialogTrigger asChild>
						<button className="flex mx-8 lg:my-24 my-12   items-center gap-4 text-white cursor-pointer">
							<div className="hidden lg:flex gap-2 hover:underline">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									fill="currentColor"
								>
									<path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
								</svg>
								<h1 className="text-sm  ">Back to home page</h1>
							</div>
							<div className="lg:hidden border-1 border-white p-1 rounded-sm">
								<h1 className="text-sm hover:underline ">Exit</h1>
							</div>
						</button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-[420px] bg-white text-primary">
						<DialogHeader>
							<DialogTitle className="">Leave without saving?</DialogTitle>
							<DialogDescription className="text-sm">
								Your changes haven’t been saved. If you leave now, they’ll be
								lost.
							</DialogDescription>
						</DialogHeader>

						<DialogFooter className="gap-2">
							<DialogClose asChild>
								<Button variant="ghost" className="border-1 border-black/60">
									Stay
								</Button>
							</DialogClose>

							<Button
								variant="destructive"
								onClick={() => {
									router.push("/host");
								}}
							>
								Leave anyway
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<div className="lg:hidden">
					<EditSections_phone childSaveOnUnmount={childSaveOnUnmount} />
				</div>
				<div className="hidden lg:block">
					<EditSections_desktop childSaveOnUnmount={childSaveOnUnmount} />
				</div>
			</div>

			<div className="min-h-screen  bg-white">
				<EditArea childSaveOnUnmount={childSaveOnUnmount} />
			</div>
		</div>
	);
}
