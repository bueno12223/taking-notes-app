"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Note } from "@/types/note";
import { formatCardDate } from "@/lib/note-utils";
import { CATEGORY_CARD_STYLES } from "@/constants";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const dateLabel = formatCardDate(note.updated_at);
  const cardStyle = CATEGORY_CARD_STYLES[note.category] || CATEGORY_CARD_STYLES["brand-peach"];

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    editable: false,
    editorProps: {
      attributes: {
        class: "font-sans text-[12px] leading-[15px] text-black pointer-events-none p-0 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && note.content) {
      editor.commands.setContent(note.content);
    }
  }, [editor, note.content]);

  return (
    <article
      onClick={onClick}
      className={`relative flex flex-col w-[303px] h-[246px] rounded-[11px] p-4 gap-3 transition-all cursor-pointer border-[3px] shadow-[1px_1px_2px_rgba(0,0,0,0.25)] hover:brightness-95 active:scale-[0.98] overflow-hidden shrink-0 ${cardStyle}`}
    >
      <header className="flex items-start gap-2 h-[15px] shrink-0">
        <span className="font-sans font-bold text-[12px] leading-[15px] text-black shrink-0">
          {dateLabel}
        </span>
        <span className="font-sans font-normal text-[12px] leading-[15px] text-black/50 overflow-hidden text-ellipsis whitespace-nowrap">
          {note.category.replace("brand-", "")}
        </span>
      </header>

      <h3 className="w-full h-[29px] font-serif font-bold text-[24px] leading-[29px] text-black overflow-hidden text-ellipsis whitespace-nowrap shrink-0">
        {note.title}
      </h3>

      <div className="w-full h-[125px] overflow-hidden mask-fade-bottom">
        <EditorContent editor={editor} />
      </div>
    </article>
  );
}
