"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  content: Record<string, unknown>;
  onChange: (json: Record<string, unknown>) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Pour your heart out..." }),
    ],
    content,
    onUpdate: ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class:
          "flex-1 w-full bg-transparent border-none outline-none font-sans font-normal text-[16px] leading-[27px] text-black focus:outline-none prose [&>h1]:font-serif [&>h1]:font-bold [&>h2]:font-serif [&>h2]:font-bold [&>h3]:font-serif [&>h3]:font-bold min-h-full",
      },
    },
    immediatelyRender: false,
  });

  return (
    <EditorContent
      editor={editor}
      className="flex flex-1 overflow-auto [&>.tiptap]:flex-1 [&>.tiptap]:h-full [&>.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&>.tiptap_p.is-editor-empty:first-child::before]:text-black/40 [&>.tiptap_p.is-editor-empty:first-child::before]:float-left [&>.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&>.tiptap_p.is-editor-empty:first-child::before]:h-0"
    />
  );
}
