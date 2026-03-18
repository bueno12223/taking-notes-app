import React from "react";
import { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(note.updated_at));

  const truncatedContent =
    note.content.length > 150
      ? note.content.substring(0, 150) + "..."
      : note.content;

  return (
    <article className="bg-[#FAF1E3] border border-[#957139]/20 rounded-[12px] p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <span className="font-sans font-normal text-[12px] text-brand-walnut/60">
          {formattedDate}
        </span>
        <h3 className="font-serif font-bold text-[20px] text-brand-walnut leading-tight">
          {note.title}
        </h3>
      </div>
      <p className="font-sans font-normal text-[14px] text-black/70 leading-relaxed whitespace-pre-wrap">
        {truncatedContent}
      </p>
    </article>
  );
}
