'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { PlaceDescriptionProps } from './types/types';
import { RefObject } from 'react';

const MAX_CHARS = 1400;

const EMOJIS = ['🔥', '❤️', '😂', '👍', '💎', '📅', '📍'];

interface DraftEditorProps {
  dataRef: RefObject<any>;
  childSaveOnUnmount: RefObject<() => void>;
}

const DraftEditor = ({ dataRef, childSaveOnUnmount }: DraftEditorProps) => {
  const [editorState, setEditorState] = useState(
    dataRef.current?.description
      ? EditorState.createWithContent(
          convertFromRaw(dataRef.current.description),
        )
      : EditorState.createEmpty(),
  );

  const [boldSelected, setBoldSelected] = useState(false);

  const [italicSelected, setItalicSelected] = useState(false);

  const editorStateRef = useRef(editorState);
  editorStateRef.current = editorState; // update every render

  function updateDataRef() {
    dataRef.current.description = convertToRaw(
      editorStateRef.current.getCurrentContent(),
    );
    console.log(dataRef);
  }

  useEffect(() => {
    childSaveOnUnmount.current = updateDataRef;

    return () => {
      childSaveOnUnmount.current = () => {};
    };
  }, []);

  const savedRawRef = useRef<any>(null);

  const toContent = () => {
    savedRawRef.current = convertToRaw(editorState.getCurrentContent());
    console.log('Saved raw:', savedRawRef.current);
  };

  const toPrintContent = () => {
    if (!savedRawRef.current) return;
    setEditorState(
      EditorState.createWithContent(convertFromRaw(savedRawRef.current)),
    );
  };

  const handleChange = (state: EditorState) => {
    const contentLength = state.getCurrentContent().getPlainText('').length;
    if (contentLength > MAX_CHARS) {
      toast('Máximo 1400 caracteres', {
        description: '',
        action: {
          label: 'Understood',
          onClick: () => console.log('Understood'),
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
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: 'BOLD' | 'ITALIC') => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const insertEmoji = (emoji: string) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = Modifier.insertText(contentState, selection, emoji);
    const newEditorState = EditorState.push(
      editorState,
      newContent,
      'insert-characters',
    );
    handleChange(newEditorState);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="">
        {' '}
        <span className="font-semibold">Caracteres restantes: </span>{' '}
        {editorState.getCurrentContent().getPlainText('').length} / 1400
      </div>
      <div className="mb-0 flex flex-wrap gap-2 mt-12 ml-4">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setBoldSelected((prev) => !prev);
            toggleInlineStyle('BOLD');
          }}
          className={`px-2 py-1 ${boldSelected ? 'bg-blue-600' : 'bg-black/80'} text-white rounded `}
        >
          Bold
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setItalicSelected((prev) => !prev);
            toggleInlineStyle('ITALIC');
          }}
          className={`px-2 py-1 ${italicSelected ? 'bg-green-600' : 'bg-black/80'} text-white rounded`}
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
      <div className="w-3xl h-186  mt-4 rounded-lg border-2 border-amber-600 p-8 bg-gray-600/40">
        {/* Toolbar */}

        {/* Editor */}
        <div className=" h-full p-4 bg-white rounded overflow-auto text-md">
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
