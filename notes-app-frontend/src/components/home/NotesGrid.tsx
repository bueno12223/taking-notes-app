import React from "react";
import { Note } from "@/types/note";
import NoteCard from "./NoteCard";

interface NotesGridProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}

export default function NotesGrid({ notes, onNoteClick }: NotesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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
