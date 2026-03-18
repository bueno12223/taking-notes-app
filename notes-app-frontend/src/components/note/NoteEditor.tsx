"use client";

import VoiceButton from "./VoiceButton";
import RichTextEditor from "./RichTextEditor";

interface NoteEditorProps {
  lastEdited?: string;
  title: string;
  content: Record<string, unknown>;
  onTitleChange: (title: string) => void;
  onContentChange: (content: Record<string, unknown>) => void;
}

export default function NoteEditor({ lastEdited, title, content, onTitleChange, onContentChange }: NoteEditorProps) {
  return (
    <div
      className="relative flex flex-col flex-1 mx-[37px] mb-[64px] mt-[15px] rounded-[11px] p-[39px_64px_64px] gap-6 overflow-hidden"
      style={{
        background: "rgba(239, 156, 102, 0.5)",
        border: "3px solid #EF9C66",
        boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="text-right font-sans font-normal text-[12px] text-black">
        {lastEdited ?? ""}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Note Title"
        className="w-full bg-transparent border-none outline-none font-serif font-bold text-[24px] text-black placeholder:text-black/40"
      />

      <RichTextEditor content={content} onChange={onContentChange} />

      <VoiceButton />
    </div>
  );
}
