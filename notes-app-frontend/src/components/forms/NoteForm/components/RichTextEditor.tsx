"use client";

import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export interface RichTextEditorRef {
  appendText: (text: string) => void;
}

interface RichTextEditorProps {
  content: Record<string, unknown>;
  onChange: (json: Record<string, unknown>) => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ content, onChange }, ref) => {
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

    useImperativeHandle(ref, () => ({
      appendText: (text: string) => {
        if (!editor) return;
        const insertPos = editor.state.doc.content.size;
        editor.commands.insertContentAt(insertPos, ` ${text}`);
      },
    }));

    useEffect(() => {
      if (!editor || !content) return;
      const currentJson = editor.getJSON();
      if (JSON.stringify(currentJson) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }, [editor, content]);

    return (
      <EditorContent
        editor={editor}
        className="flex flex-1 overflow-auto [&>.tiptap]:flex-1 [&>.tiptap]:h-full [&>.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&>.tiptap_p.is-editor-empty:first-child::before]:text-black/40 [&>.tiptap_p.is-editor-empty:first-child::before]:float-left [&>.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&>.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:leading-[27px] [&_li]:my-0 [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-[28px] [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-[22px] [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-[18px]"
      />
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
