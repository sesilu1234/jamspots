import { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PlaceDescriptionProps } from "./types/types";

import dynamic from "next/dynamic";

const DraftEditor = dynamic(() => import("./textSlate"), {
	ssr: false,
});

export default function PlaceDescription({
	data,
	childSaveOnUnmount,
}: PlaceDescriptionProps) {
	const [text, setText] = useState("");

	return (
		<div className="pb-12 p-6 pt-0 flex flex-col gap-3">
			<Toaster />
			<div className="ml-4 xl:ml-48 mt-0">
				<DraftEditor data={data} childSaveOnUnmount={childSaveOnUnmount} />
			</div>
		</div>
	);
}
