import React from "react";
import { Note } from "@/types/note";
import NoteCard from "./NoteCard";

interface NotesGridProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}

export default function NotesGrid({ notes, onNoteClick }: NotesGridProps) {
  return (
    <div className="flex flex-row flex-wrap items-start content-start p-0 gap-y-[16px] gap-x-[13px]">
      {notes.map((note) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onClick={() => onNoteClick(note)}
        />
      ))}
    </div>
  );
}
