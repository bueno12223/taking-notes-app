"use client";

import React, { useRef, useState, useCallback } from "react";
import RichTextEditor, { RichTextEditorRef } from "./components/RichTextEditor";
import VoiceRecorder from "./components/VoiceRecorder";
import { AutosaveErrors, SaveStatus } from "@/hooks/useAutosave";
import { CATEGORY_STYLES } from "@/constants";
import { formatLastEdited } from "@/lib/note-utils";
import { FormikProps } from "formik";
import { NoteFormValues } from "./validations";

interface NoteEditorProps {
  form: FormikProps<NoteFormValues>;
  noteId: number | null;
  saveStatus: SaveStatus;
  autosaveErrors: AutosaveErrors;
  lastSavedAt: string | null;
  onClose: () => void;
}

export default function NoteForm({
  form,
  noteId,
  autosaveErrors,
  lastSavedAt,
}: NoteEditorProps) {
  const { values, setFieldValue } = form;
  const editorRef = useRef<RichTextEditorRef>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const activeError = autosaveErrors.title || autosaveErrors.category || autosaveErrors.content || null;
  const currentStyle = CATEGORY_STYLES[values.category] || CATEGORY_STYLES["brand-peach"];

  const handleTranscript = useCallback((text: string) => {
    editorRef.current?.appendText(text);
  }, []);

  return (
    <div
      className={`relative flex flex-col flex-1 m-4 border-[3px] shadow-[1px_1px_2px_rgba(0,0,0,0.25)] rounded-[11px] p-[39px_64px_64px] gap-[24px] pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-500 transition-colors duration-300 ${currentStyle}`}
    >
      <div className="min-h-[15px] text-right shrink-0">
        {activeError ? (
          <span className="font-sans font-normal text-[12px] leading-[15px] text-brand-gold animate-in fade-in slide-in-from-top-1">
            {activeError}
          </span>
        ) : (
          <span className="font-sans font-normal text-[12px] leading-[15px] text-black">
            {noteId !== null && lastSavedAt ? `Last Edited: ${formatLastEdited(lastSavedAt)}` : ""}
          </span>
        )}
      </div>

      <input
        type="text"
        value={values.title}
        onChange={(e) => setFieldValue("title", e.target.value)}
        placeholder="Note Title"
        className="w-full h-[29px] bg-transparent border-none outline-none font-serif font-bold text-[24px] leading-[29px] text-black placeholder:text-black/40 shrink-0"
      />

      <div className="w-full flex-1 overflow-auto">
        <RichTextEditor
          ref={editorRef}
          content={values.content as Record<string, unknown>}
          onChange={(newContent) => setFieldValue("content", newContent)}
        />
      </div>

      <VoiceRecorder
        category={values.category}
        onTranscript={handleTranscript}
        isActive={isVoiceActive}
        setIsActive={setIsVoiceActive}
      />
    </div>
  );
}
