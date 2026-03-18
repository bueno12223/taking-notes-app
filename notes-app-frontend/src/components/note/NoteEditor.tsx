"use client";

import VoiceButton from "./VoiceButton";

interface NoteEditorProps {
  lastEdited?: string;
}

export default function NoteEditor({ lastEdited }: NoteEditorProps) {
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
        placeholder="Note Title"
        className="w-full bg-transparent border-none outline-none font-serif font-bold text-[24px] text-black placeholder:text-black/40"
      />

      <textarea
        placeholder="Pour your heart out..."
        className="flex-1 w-full bg-transparent border-none outline-none resize-none font-sans font-normal text-[16px] leading-[27px] text-black placeholder:text-black/40"
      />

      <VoiceButton />
    </div>
  );
}
