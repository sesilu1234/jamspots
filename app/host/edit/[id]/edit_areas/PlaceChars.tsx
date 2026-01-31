import { useState, useRef, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaceCharsProps } from "./types/types";

import { useAtom } from "jotai";
import { formAtom } from "../store/jotai";

import { useFormStore } from "../store/formStore"; // path a tu store

const all_styles = [
	// Musical styles
	"Blues",
	"Rock",
	"All styles",
	"Country",
	"Jazz",
	"Pop",
	"Funk",
	"Soul",
	"Reggae",
	"Metal",
	"Hip-Hop",
	"R&B",
	"Disco",
	"House",
	"Trance",
	"Electronic",
	"Acoustic",
	"Singer-Songwriter",
	"Folk",
	"Indie",
	"Alternative",
	"Roots",
	"Afro",
	"Fusion",
	"Latin",

	// Moods / vibes
	"Improvisation",
	"Open Mic",
];

export default function PlaceChars({
	data,
	childSaveOnUnmount,
}: PlaceCharsProps) {
	const setForm = useFormStore((state) => state.setForm);

	const [search, setSearch] = useState("");

	const [selectedStyles, setSelectedStyles] = useState<string[]>(data.styles);
	const [song_list, setSongList] = useState<boolean>(data.song_list);
	const [instruments_lend, setIntrumentsLend] = useState<boolean>(
		data.intruments_lend,
	);
	const [drums, setDrums] = useState<boolean>(data.drums);

	const stylesRef = useRef(selectedStyles);
	stylesRef.current = selectedStyles;

	const songRef = useRef(song_list);
	songRef.current = song_list;

	const instrumentsRef = useRef(instruments_lend);
	instrumentsRef.current = instruments_lend;

	const drumsRef = useRef(drums);
	drumsRef.current = drums;

	const filteredStyles = all_styles.filter((style) =>
		style.toLowerCase().includes(search.toLowerCase()),
	);

	const toggleStyle = (style: string) => {
		if (selectedStyles.includes(style)) {
			setSelectedStyles(selectedStyles.filter((s) => s !== style));
		} else {
			setSelectedStyles([...selectedStyles, style]);
		}
	};

	function updateDataRef() {
		setForm((prev) => ({
			...prev,
			features: {
				styles: stylesRef.current,
				song_list: songRef.current,
				intruments_lend: instrumentsRef.current,
				drums: drumsRef.current,
			},
		}));
	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/immutability
		childSaveOnUnmount.current = updateDataRef;

		return () => {
			childSaveOnUnmount.current = () => {};
		};
	}, []);

	return (
		<div className="p-6 flex flex-col gap-3">
			<div className="max-w-[70%] ml-[10%]">
				<div className="flex justify-between">
					<span className="">Styles</span>
					<span>{selectedStyles.length} / 3</span>
				</div>

				<Input
					type="search"
					placeholder="Search for styles"
					className="w-72 mt-6"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<div className="flex flex-wrap gap-2 mt-4 border p-2 rounded max-h-60 w-3/4 overflow-y-auto">
					{filteredStyles.map((style) => {
						const isSelected = selectedStyles.includes(style);
						return (
    <div
        key={style}
        className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer whitespace-nowrap transition-colors ${
            isSelected
                ? "bg-emerald-700 text-white" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
        onClick={() => toggleStyle(style)}
    >
        <span className="text-sm font-medium">{style}</span>
        <span className="ml-2 font-bold">{isSelected ? "×" : "+"}</span>
    </div>
);
					})}
				</div>

				{selectedStyles.length > 0 && (
					<div className="mt-4">
						<span className="font-semibold">Selected Styles: </span>
						{selectedStyles.join(", ")}
					</div>
				)}

				<div className="flex flex-col gap-4 mt-16">
					<div className="flex  items-center gap-6">
						{" "}
						<span className="w-48 font-semibold ">Is there a setlist?</span>
						<Button
							variant={null}
							className={`w-12 ${
								song_list
									? "bg-blue-500 text-white "
									: "bg-background hover:bg-primary/30"
							}`}
							onClick={() => setSongList(true)}
						>
							Yes
						</Button>
						<Button
							variant={null}
							className={`w-12 ${
								!song_list
									? "bg-blue-500 text-white"
									: "bg-background hover:bg-primary/30"
							}`}
							onClick={() => setSongList(false)}
						>
							No
						</Button>
					</div>
					<div className="flex items-center gap-6">
						{" "}
						<span className="w-48 font-semibold ">
							Are instruments available to borrow?
						</span>
						<Button
							variant={null}
							className={`w-12 ${
								instruments_lend
									? "bg-blue-500 text-white"
									: "bg-background hover:bg-primary/30"
							}`}
							onClick={() => setIntrumentsLend(true)}
						>
							Yes
						</Button>
						<Button
							variant={null}
							className={`w-12 ${
								!instruments_lend
									? "bg-blue-500 text-white"
									: " bg-background hover:bg-primary/30"
							}`}
							onClick={() => setIntrumentsLend(false)}
						>
							No
						</Button>
					</div>
					<div className="flex  items-center gap-6">
						{" "}
						<span className="w-48 font-semibold ">Is there a drum kit?</span>
						<Button
							variant={null}
							className={`w-12 ${
								drums
									? "bg-blue-500 text-white"
									: "bg-background hover:bg-primary/30"
							}`}
							onClick={() => setDrums(true)}
						>
							Yes
						</Button>
						<Button
							variant={null}
							className={`w-12 ${
								!drums
									? "bg-blue-500 text-white"
									: "bg-background hover:bg-primary/30"
							}`}
							onClick={() => setDrums(false)}
						>
							No
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
