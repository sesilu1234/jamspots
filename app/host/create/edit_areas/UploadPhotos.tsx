"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import TrashButton from "./icons/TrashButton";
import { UploadPhotosProps } from "./types/types";

import { useFormStore } from "../store/formStore"; // path a tu store

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortablePhoto({ url, removePhoto }) {
	const { setNodeRef, attributes, listeners, transform, transition } =
		useSortable({ id: url });

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				touchAction: "none", // 👈 VERY IMPORTANT
				position: "relative",
				width: 160,
				height: 160,
			}}
			className="rounded-xl overflow-hidden"
		>
			{/* DRAG HANDLE */}
			<div
				{...listeners}
				className="absolute top-1 left-1 z-10 cursor-grab bg-black/50 text-white px-2 rounded lg:rotate-90"
			>
				⇅
			</div>

			<Image src={url} alt="preview" fill className="object-cover" />

			<TrashButton onClick={() => removePhoto(url)} />
		</div>
	);
}

export default function PhotoUploader({
	data,
	childSaveOnUnmount,
}: UploadPhotosProps) {
	const setForm = useFormStore((state) => state.setForm);

	const [photos, setPhotos] = useState<string[]>(data.images);
	const photoStateRef = useRef(photos);
	photoStateRef.current = photos;

	useEffect(() => {
		childSaveOnUnmount.current = () => {
			setForm((prev) => ({
				...prev,
				photos: {
					images: photoStateRef.current,
				},
			}));
		};

		return () => {
			childSaveOnUnmount.current = () => {};
		};
	}, []);

	function handleFile(e) {
		const newImages = Array.from(e.target.files).map((file) =>
			URL.createObjectURL(file),
		);

		if (!newImages) return;

		setPhotos((prev) => [...prev, ...newImages].slice(0, 4));
		e.target.value = ""; // allow re-upload same file
	}

	function removePhoto(url: string) {
		setPhotos((prev) => prev.filter((u) => u !== url));
	}

	function handleDragEnd({ active, over }) {
		if (!over || active.id === over.id) return;

		setPhotos((prev) => {
			const oldIndex = prev.findIndex((u) => u === active.id);
			const newIndex = prev.findIndex((u) => u === over.id);
			return arrayMove(prev, oldIndex, newIndex);
		});
	}

	return (
		<div className="pt-0 px-15">
			<div className="flex gap-4">
		<span className="">	Upload exactly 3 photos</span> 

		<div className="w-[2px] bg-black/40"></div>
		
		<span style={{ color: photos.length === 3 ? '' : photos.length > 3 ? 'red' : 'black' }}>
  {photos.length} / 3
</span>


		</div>
		<div className=" pt-8 lg:pt-15 pt-4 lg:pt-15 flex flex-col gap-3">
			<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={photos}>
					<div className="flex gap-3 flex-wrap">
						{photos.map((url) => (
							<SortablePhoto key={url} url={url} removePhoto={removePhoto} />
						))}

						{photos.length < 4 && (
							<label className="w-40 h-40 bg-gray-300 rounded-xl flex items-center justify-center cursor-pointer text-black">
								+ Upload Image
								<input
									type="file"
									multiple
									accept="image/*"
									onChange={handleFile}
									className="hidden"
								/>
							</label>
						)}
					</div>
				</SortableContext>
			</DndContext>
		</div>
		</div>
	);
}
