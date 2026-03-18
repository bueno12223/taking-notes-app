"use client";

import { format } from "date-fns";
import VoiceButton from "./VoiceButton";
import RichTextEditor from "./RichTextEditor";
import { AutosaveErrors } from "@/hooks/useAutosave";
import { CATEGORY_STYLES } from "./constants";

interface NoteEditorProps {
  noteId: number | null;
  lastSavedAt: string | null;
  title: string;
  content: Record<string, unknown>;
  category: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: Record<string, unknown>) => void;
  errors: AutosaveErrors;
}

function formatLastEdited(isoDate: string): string {
  return format(new Date(isoDate), "MMMM d, yyyy 'at' h:mmaaaaa'm'");
}

export default function NoteEditor({
  noteId,
  lastSavedAt,
  title,
  content,
  category,
  onTitleChange,
  onContentChange,
  errors,
}: NoteEditorProps) {
  const activeError = errors.title || errors.category || errors.content || null;
  
  const currentStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES["brand-peach"];

  return (
    <div
      className={`relative flex flex-col flex-1 mx-[37px] mb-[64px] mt-[15px] rounded-[11px] p-[39px_64px_64px] gap-6 overflow-hidden border-[3px] shadow-[1px_1px_2px_rgba(0,0,0,0.25)] transition-colors duration-300 ${currentStyle}`}
    >
      <div className="min-h-[18px] text-right">
        {activeError ? (
          <span className="font-sans font-normal text-[12px] text-brand-gold animate-in fade-in slide-in-from-top-1">
            {activeError}
          </span>
        ) : (
          <span className="font-sans font-normal text-[12px] text-black/50">
            {noteId !== null && lastSavedAt ? formatLastEdited(lastSavedAt) : ""}
          </span>
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Note Title"
        className="w-full bg-transparent border-none outline-none font-serif font-bold text-[24px] text-black placeholder:text-black/40"
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <RichTextEditor content={content} onChange={onContentChange} />
      </div>

      <VoiceButton />
    </div>
  );
}
