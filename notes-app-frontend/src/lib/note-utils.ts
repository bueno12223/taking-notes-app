import { TiptapNode } from "@/types/note";

/**
 * Recursively extracts plain text from a Tiptap JSON node structure.
 */
export function extractPlainText(node: TiptapNode | Record<string, unknown>): string {
  const n = node as TiptapNode;
  if (n.text) return n.text;
  if (!n.content) return "";
  return n.content.map(extractPlainText).join("");
}
