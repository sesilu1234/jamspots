"use client";

import React, { useState, useRef, useEffect } from "react";
import {
	Editor,
	EditorState,
	RichUtils,
	Modifier,
	convertToRaw,
	convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { DescriptionType } from "./types/types";
import { RefObject } from "react";
import { RawDraftContentState } from "draft-js";

import { useAtom } from "jotai";
import { formAtom } from "../store/jotai";
import { useFormStore } from "../store/formStore"; // path a tu store

const MAX_CHARS = 1400;

const EMOJIS = ["🔥", "❤️", "😂", "👍", "💎", "📅", "📍"];

interface DraftEditorProps {
	data: DescriptionType;
	childSaveOnUnmount: RefObject<() => void>;
}

const DraftEditor = ({ data, childSaveOnUnmount }: DraftEditorProps) => {
	const setForm = useFormStore((state) => state.setForm);

	const [editorState, setEditorState] = useState(
		data.description
			? EditorState.createWithContent(convertFromRaw(data.description))
			: EditorState.createEmpty(),
	);

	const [boldSelected, setBoldSelected] = useState(false);

	const [italicSelected, setItalicSelected] = useState(false);

	const editorStateRef = useRef(editorState);
	editorStateRef.current = editorState; // update every render

	function updateDataRef() {
		setForm((prev) => ({
			...prev,
			description: {
				description: convertToRaw(editorStateRef.current.getCurrentContent()),
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

	const handleChange = (state: EditorState) => {
		const contentLength = state.getCurrentContent().getPlainText("").length;
		if (contentLength > MAX_CHARS) {
			toast("Máximo 1400 caracteres", {
				description: "",
				action: {
					label: "Understood",
					onClick: () => console.log("Understood"),
				},
			});
			return; // don’t update state
		}
		setEditorState(state);
	};

	const handleKeyCommand = (command: string, state: EditorState) => {
		const newState = RichUtils.handleKeyCommand(state, command);
		if (newState) {
			handleChange(newState);
			return "handled";
		}
		return "not-handled";
	};

	const toggleInlineStyle = (style: "BOLD" | "ITALIC") => {
		handleChange(RichUtils.toggleInlineStyle(editorState, style));
	};

	const insertEmoji = (emoji: string) => {
		const contentState = editorState.getCurrentContent();
		const selection = editorState.getSelection();
		const newContent = Modifier.insertText(contentState, selection, emoji);
		const newEditorState = EditorState.push(
			editorState,
			newContent,
			"insert-characters",
		);
		handleChange(newEditorState);
	};

	return (
		<div className="flex flex-col gap-2 ">
			<div className="">
				{" "}
				<span className="font-semibold">Characters remaining: </span>{" "}
				{editorState.getCurrentContent().getPlainText("").length} / 1400
			</div>
			<div className="mb-0 flex flex-wrap gap-2 mt-2 ml-4">
				<button
					onMouseDown={(e) => {
						e.preventDefault();
						setBoldSelected((prev) => !prev);
						toggleInlineStyle("BOLD");
					}}
					className={`px-2 py-1 ${
						boldSelected ? "bg-blue-600" : "bg-black/80"
					} text-white rounded `}
				>
					Bold
				</button>
				<button
					onMouseDown={(e) => {
						e.preventDefault();
						setItalicSelected((prev) => !prev);
						toggleInlineStyle("ITALIC");
					}}
					className={`px-2 py-1 ${
						italicSelected ? "bg-green-600" : "bg-black/80"
					} text-white rounded`}
				>
					Italic
				</button>

				{/* Emoji panel */}
				{EMOJIS.map((emoji) => (
					<button
						key={emoji}
						onMouseDown={(e) => {
							e.preventDefault();
							insertEmoji(emoji);
						}}
						className="px-2 py-1 bg-gray-200 rounded hover:bg-yellow-300"
					>
						{emoji}
					</button>
				))}
			</div>
			<div className="w-full lg:w-3xl h-124  mt-4 rounded-lg  border-4 border-black/50 p-8 bg-gray-600/15">
				{/* Toolbar */}

				{/* Editor */}
				<div className=" h-full p-4 rounded overflow-auto text-lg">
					<Editor
						editorState={editorState}
						onChange={handleChange}
						handleKeyCommand={handleKeyCommand}
						placeholder="Start typing..."
					/>
				</div>
			</div>
			<Toaster />
		</div>
	);
};

export default DraftEditor;
