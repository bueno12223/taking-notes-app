export interface Note {
  id: number;
  title: string;
  content: TiptapNode | Record<string, unknown>;
  category: string;
  user: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a node in the Tiptap JSON structure.
 */
export interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}
