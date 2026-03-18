import { TiptapNode } from "@/types/note";
import { format, isToday, isYesterday } from "date-fns";

/**
 * Recursively extracts plain text from a Tiptap JSON node structure.
 */
export function extractPlainText(node: TiptapNode | Record<string, unknown>): string {
  const n = node as TiptapNode;
  if (!n) return "";
  if (n.text) return n.text;
  if (!n.content) return "";
  return n.content.map(extractPlainText).join("");
}

/**
 * Formats a date for the NoteCard based on proximity to today.
 */
export function formatCardDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isToday(date)) return "today";
  if (isYesterday(date)) return "yesterday";
  return format(date, "MMMM d");
}

/**
 * Formats the last edited date for the Note Editor header.
 * Example: "June 12, 2026 at 10:30am"
 */
export function formatLastEdited(isoDate: string): string {
  return format(new Date(isoDate), "MMMM d, yyyy 'at' h:mmaaaaa'm'");
}

/**
 * Checks if a Tiptap content structure is effectively empty.
 */
export function isContentEmpty(content: TiptapNode | Record<string, unknown>): boolean {
  const doc = content as TiptapNode;
  if (!doc.content || doc.content.length === 0) return true;
  
  const checkNode = (node: TiptapNode): boolean => {
    if (node.text && node.text.trim().length > 0) return false;
    if (node.content && node.content.length > 0) {
      return node.content.every(checkNode);
    }
    return true;
  };

  return doc.content.every(checkNode);
}
